/**
 * 画面仕様JSON自動抽出スクリプト
 *
 * 実際のブラウザで画面を開き、DOM構造を解析して画面仕様JSONを生成します。
 *
 * 使用方法:
 *   npx ts-node scripts/extract-screen-spec.ts [画面URL]
 *
 * 例:
 *   npx ts-node scripts/extract-screen-spec.ts /todos.html
 *   npx ts-node scripts/extract-screen-spec.ts /projects.html
 *   npx ts-node scripts/extract-screen-spec.ts /users.html
 *   npx ts-node scripts/extract-screen-spec.ts --all  # 全画面を抽出
 */

import { chromium, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ElementInfo {
  id: string;
  selector: string;
  altSelectors?: string[];
  type: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  vueSelector: string;
  action?: string;
  expectedText?: string;
  url?: string;
  children?: Record<string, { selector: string; vueSelector: string }>;
}

interface ScreenSpec {
  screenId: string;
  screenName: string;
  url: string;
  urlParams?: Record<string, { type: string; description: string }>;
  elements: {
    inputs: ElementInfo[];
    buttons: ElementInfo[];
    dynamicElements: ElementInfo[];
    stats?: ElementInfo[];
    messages: ElementInfo[];
    links: ElementInfo[];
  };
  waitConditions: Record<string, { selector: string; state: string }>;
  apiEndpoints: Record<string, { method: string; url: string; params?: string[] }>;
  metadata: {
    lastUpdated: string;
    sourceHtml: string;
    extractedAt: string;
    notes: string[];
  };
}

const BASE_URL = 'http://localhost:8080';

const SCREEN_CONFIG: Record<string, { screenId: string; screenName: string }> = {
  '/todos.html': { screenId: 'SCR-TODOS-001', screenName: 'ToDo管理画面' },
  '/projects.html': { screenId: 'SCR-PROJECTS-001', screenName: '案件一覧画面' },
  '/users.html': { screenId: 'SCR-USERS-001', screenName: 'ユーザー管理画面' },
};

async function extractScreenSpec(page: Page, url: string): Promise<ScreenSpec> {
  const config = SCREEN_CONFIG[url] || {
    screenId: `SCR-${url.replace(/[^a-zA-Z0-9]/g, '-').toUpperCase()}`,
    screenName: url
  };

  // ページ読み込み完了を待機
  await page.goto(`${BASE_URL}${url}`);
  await page.waitForLoadState('networkidle');

  // ローディング完了を待機
  try {
    await page.waitForSelector('#loading', { state: 'hidden', timeout: 5000 });
  } catch {
    // loadingがない場合は無視
  }

  // 要素を抽出
  const elements = await page.evaluate(() => {
    const result = {
      inputs: [] as any[],
      buttons: [] as any[],
      dynamicElements: [] as any[],
      stats: [] as any[],
      messages: [] as any[],
      links: [] as any[],
    };

    // ヘルパー関数
    const generateId = (el: Element, prefix: string) => {
      const id = el.id || el.getAttribute('name') || '';
      if (id) return id.replace(/-/g, '').replace(/_/g, '');
      const placeholder = el.getAttribute('placeholder') || '';
      if (placeholder) return prefix + placeholder.slice(0, 10).replace(/[^a-zA-Z0-9]/g, '');
      return prefix + Math.random().toString(36).slice(2, 6);
    };

    const getSelector = (el: Element): string => {
      if (el.id) return `#${el.id}`;
      const classes = Array.from(el.classList).filter(c => !c.includes('active'));
      if (classes.length > 0) return `.${classes.join('.')}`;
      return el.tagName.toLowerCase();
    };

    const generateVueSelector = (el: Element, prefix: string): string => {
      const id = el.id?.replace(/-/g, '-') || prefix;
      return `[data-testid='${id}']`;
    };

    // input/textareaを抽出
    document.querySelectorAll('input:not([type="hidden"]), textarea, select').forEach(el => {
      const inputEl = el as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      const type = el.tagName.toLowerCase() === 'select' ? 'select' :
                   el.tagName.toLowerCase() === 'textarea' ? 'textarea' :
                   (inputEl as HTMLInputElement).type || 'text';

      // フォームの一部でないものはスキップ
      const form = el.closest('.add-todo, .add-form, .add-user, form');
      const placeholder = el.getAttribute('placeholder') || '';
      const label = el.closest('.date-field, .assignee-field')?.querySelector('label')?.textContent ||
                    placeholder.replace(/を入力.*|（.*）/g, '') || '';

      result.inputs.push({
        id: generateId(el, 'input'),
        selector: getSelector(el),
        altSelectors: placeholder ? [`[placeholder='${placeholder}']`] : [],
        type,
        label: label.trim(),
        placeholder: placeholder || undefined,
        required: inputEl.required,
        vueSelector: generateVueSelector(el, `${type}-input`),
      });
    });

    // ボタンを抽出
    document.querySelectorAll('button, .filter-buttons button').forEach(el => {
      const btn = el as HTMLButtonElement;
      const text = btn.textContent?.trim() || '';
      const isFilter = el.closest('.filter-buttons') !== null;

      result.buttons.push({
        id: generateId(el, 'btn'),
        selector: getSelector(el),
        altSelectors: text ? [`button:has-text('${text}')`] : [],
        type: 'button',
        label: text,
        action: isFilter ? 'filter' : btn.onclick?.toString().match(/(\w+)\(/)?.[1] || 'click',
        vueSelector: generateVueSelector(el, `${text.toLowerCase().replace(/[^a-z]/g, '')}-btn`),
      });
    });

    // 動的リスト要素を抽出
    const listContainers = document.querySelectorAll('#todo-list, #project-list, #user-list');
    listContainers.forEach(container => {
      const items = container.querySelectorAll('.todo-item, .project-card:not(.no-project), .user-item');
      if (items.length > 0) {
        const item = items[0];
        const children: Record<string, { selector: string; vueSelector: string }> = {};

        // 子要素を解析
        item.querySelectorAll('h3, p, button, .date-range, .assignee, .stats, .progress-bar .progress').forEach(child => {
          const tag = child.tagName.toLowerCase();
          const className = child.className.split(' ')[0] || tag;
          children[className.replace(/-/g, '')] = {
            selector: child.className ? `.${child.className.split(' ')[0]}` : tag,
            vueSelector: `[data-testid='item-${className}']`,
          };
        });

        result.dynamicElements.push({
          id: item.className.split(' ')[0].replace(/-/g, ''),
          selector: `.${item.className.split(' ')[0]}`,
          type: 'list-item',
          vueSelector: `[data-testid='${item.className.split(' ')[0]}']`,
          children,
        });
      }
    });

    // 統計表示を抽出
    document.querySelectorAll('.stats span[id], #total-count, #completed-count, #pending-count').forEach(el => {
      result.stats.push({
        id: el.id || generateId(el, 'stat'),
        selector: `#${el.id}`,
        label: el.parentElement?.textContent?.replace(/\d+/g, '').trim() || '',
        vueSelector: generateVueSelector(el, 'stat'),
      });
    });

    // メッセージ要素を抽出
    document.querySelectorAll('#error-message, #loading, .error, .loading').forEach(el => {
      const isLoading = el.id === 'loading' || el.classList.contains('loading');
      result.messages.push({
        id: el.id || (isLoading ? 'loading' : 'error'),
        selector: getSelector(el),
        type: isLoading ? 'loading' : 'error',
        vueSelector: generateVueSelector(el, isLoading ? 'loading' : 'error'),
      });
    });

    // リンクを抽出
    document.querySelectorAll('a[href]').forEach(el => {
      const link = el as HTMLAnchorElement;
      const href = link.getAttribute('href') || '';
      result.links.push({
        id: generateId(el, 'link'),
        selector: `a[href='${href}']`,
        label: link.textContent?.trim().replace(/[←→]/g, '').trim() || '',
        url: href,
        vueSelector: generateVueSelector(el, 'link'),
      });
    });

    return result;
  });

  // 待機条件を生成
  const waitConditions: Record<string, { selector: string; state: string }> = {
    pageLoad: { selector: 'body', state: 'visible' },
  };

  if (elements.messages.find(m => m.type === 'loading')) {
    waitConditions.loadingComplete = { selector: '#loading', state: 'hidden' };
  }

  if (elements.dynamicElements.length > 0) {
    waitConditions.itemVisible = {
      selector: elements.dynamicElements[0].selector,
      state: 'visible'
    };
  }

  // APIエンドポイントを推測
  const apiEndpoints: Record<string, { method: string; url: string; params?: string[] }> = {};
  const pageContent = await page.content();

  const apiMatches = pageContent.matchAll(/fetch\([`'"]([^`'"]+)[`'"]/g);
  for (const match of apiMatches) {
    const apiUrl = match[1].replace(/\$\{[^}]+\}/g, '{id}');
    const method = pageContent.includes(`method: 'POST'`) ? 'POST' :
                   pageContent.includes(`method: 'DELETE'`) ? 'DELETE' :
                   pageContent.includes(`method: 'PATCH'`) ? 'PATCH' : 'GET';

    if (apiUrl.startsWith('/api/')) {
      const name = apiUrl.includes('{id}') ? 'single' :
                   method === 'POST' ? 'create' :
                   method === 'DELETE' ? 'delete' : 'list';
      apiEndpoints[name] = { method, url: apiUrl };
    }
  }

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  return {
    screenId: config.screenId,
    screenName: config.screenName,
    url,
    elements: {
      inputs: elements.inputs,
      buttons: elements.buttons,
      dynamicElements: elements.dynamicElements,
      stats: elements.stats.length > 0 ? elements.stats : undefined,
      messages: elements.messages,
      links: elements.links,
    },
    waitConditions,
    apiEndpoints,
    metadata: {
      lastUpdated: dateStr,
      sourceHtml: url.replace('/', ''),
      extractedAt: now.toISOString(),
      notes: [
        '自動抽出により生成',
        'altSelectors, vueSelector は必要に応じて調整してください',
      ],
    },
  } as ScreenSpec;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('使用方法: npx ts-node scripts/extract-screen-spec.ts [画面URL]');
    console.log('例: npx ts-node scripts/extract-screen-spec.ts /todos.html');
    console.log('    npx ts-node scripts/extract-screen-spec.ts --all');
    process.exit(1);
  }

  const urls = args[0] === '--all'
    ? Object.keys(SCREEN_CONFIG)
    : [args[0]];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('画面仕様JSONを抽出中...\n');

  for (const url of urls) {
    try {
      console.log(`抽出中: ${url}`);
      const spec = await extractScreenSpec(page, url);

      const filename = url.replace('/', '').replace('.html', '') + '-screen.json';
      const outputPath = path.join(__dirname, '../master/screen-spec', filename);

      fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2) + '\n', 'utf-8');
      console.log(`  → ${outputPath}`);
    } catch (error) {
      console.error(`  エラー: ${error}`);
    }
  }

  await browser.close();
  console.log('\n完了!');
}

main().catch(console.error);
