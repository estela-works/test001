#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
表示確認（Phase 8-3）— 画像とテキストの突合

スライドを1枚ずつ画像に出し、画像から文章を認識し、
HTMLの期待テキストと機械で突合して、一致しない箇所を特定する。

🔴 実行順を守ること（手順の全体は ../業務フロー.md Phase 8-3）:

    python hyoji_check.py fit    <スライド.html> <workdir>
        ① 箱のはみ出し検出。CLIP（切れる）/ SPILL（あふれる）を出力
           ⚠️ overflow の値では絞り込まない。visible でもはみ出しは不具合

    python hyoji_check.py shots  <スライド.html> <workdir>
        ② 1スライド1枚の PNG（1280x720）を書き出す

    ---- ③ ここで人（モデル）が画像を読み、workdir/seen/<同名>.txt へ転記する ----
         見えたとおりに書く。切れていたら切れたところまで。補完しない。
         🔴 このとき expected.json を開かない（答えを知ると補完してしまう）

    python hyoji_check.py expect <スライド.html> <workdir>
        ④ 期待テキストを DOM から抽出（🔴 ③が全ページ終わってから実行）
           既に seen/ が無い状態で実行しようとすると警告する

    python hyoji_check.py diff   <workdir>
        ⑤ ③と④を突合し、欠落・途中で切れている箇所を出力

workdir は必ず ASCII のパスにする（日本語パスは file:/// で詰まる）。
"""

import io
import json
import os
import re
import shutil
import subprocess
import sys
import unicodedata

# 🔴 Windows の既定コンソールは cp932 で、⚠ や 🔴 を encode できずに落ちる。
#    出力の途中で UnicodeEncodeError になると、検出結果を出したあとで異常終了し、
#    「最後まで走ったのか、途中で死んだのか」が分からなくなる。UTF-8 を強制する。
for _st in (sys.stdout, sys.stderr):
    try:
        _st.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

CHROME_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
]

# --- ① 箱のはみ出し検出 --------------------------------------------------
# 🔴 overflow の値で絞り込まない。
#    hidden/clip なら「切れる」(CLIP)、visible なら「あふれて重なる」(SPILL)。
#    どちらも不具合である。2026/8/25 まで hidden だけを見ていて検出漏れした。
#
# 🔴 SVGの子孫要素は「箱のはみ出し」判定から外す（2026/8/25 追加）。
#    Chrome は SVG の子要素の scrollWidth/clientWidth/scrollHeight/clientHeight に
#    「はみ出し量」ではなく位置・寸法の値を返し、しかも単位系が揃っていない。
#    実測（sample_deck.html の T-07）:
#      <text x="58" text-anchor="end">7.0</text>  → sw=58  cw=58  （偶然一致し無風）
#      <text x="20">（日）</text>                 → sw=86  cw=62  （差24が出て誤検出）
#    差はビューボックスの拡大率と x/y 属性に連動しており、はみ出しとは無関係である。
#    → 差が出ても意味が無いので判定しない。ただし黙って捨てず、件数と中身を報告する。
#
# ⚠️ 除外の判定に `el.ownerSVGElement !== null` を使ってはいけない。
#    HTML要素では ownerSVGElement が undefined のため、この式は **true** になり、
#    HTML要素まで全部除外されて検査そのものが無効になる（実測で確認済み）。
#    instanceof で明示的に判定する。<svg> 自身（SVGSVGElement）は除外しない。
FIT_JS = """
<script>
window.addEventListener('load', function () {
  var flags = [];
  var svgSkipped = 0;      // 箱の判定から外した SVG 子孫要素の総数
  var svgSuppressed = [];  // そのうち、外さなければ報告されていたもの
  var cn = function (el) {
    var c = el.className;
    var s = (c && c.baseVal !== undefined) ? c.baseVal : (c || '');
    return (s || el.tagName).toString().trim();
  };
  document.querySelectorAll('section.slide').forEach(function (sec, i) {
    var p = sec.querySelector('.s-page');
    var key = 'p' + ('0' + i).slice(-2) + '_' + (p ? p.textContent.trim() : 'cover');
    var sr = sec.getBoundingClientRect();
    sec.querySelectorAll('*').forEach(function (el) {
      // <svg> 自身は従来どおり判定する。その中身だけを外す。
      var inSvg = (el instanceof SVGElement) && !(el instanceof SVGSVGElement);
      var cs = getComputedStyle(el);
      var dw = el.scrollWidth - el.clientWidth;
      var dh = el.scrollHeight - el.clientHeight;
      var txt = (el.textContent || '').replace(/\\s+/g, '').slice(0, 24);
      if (inSvg) {
        svgSkipped++;
        if (dw > 1 || dh > 1) {
          svgSuppressed.push(key + '\\t' + cn(el) + '\\tw+' + dw + ' h+' + dh + '\\t' + txt);
        }
      } else if (dw > 1 || dh > 1) {
        var hid = ['hidden', 'clip'].indexOf(cs.overflowX) >= 0
               || ['hidden', 'clip'].indexOf(cs.overflowY) >= 0;
        flags.push(key + '\\t' + (hid ? 'CLIP ' : 'SPILL') + '\\t' + cn(el)
                   + '\\tw+' + dw + ' h+' + dh + '\\t' + txt);
      }
      // OUT は getBoundingClientRect（実際の描画位置）で見るため、
      // SVGの中の要素でも値が正しい。したがって除外せず、全要素で判定する。
      var r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 &&
          (r.right > sr.right + 1 || r.bottom > sr.bottom + 1 ||
           r.left < sr.left - 1 || r.top < sr.top - 1)) {
        flags.push(key + '\\tOUT  \\t' + cn(el) + '\\t-\\t' + txt);
      }
    });
  });
  document.body.innerHTML = '<pre id="D">' +
    JSON.stringify({flags: flags, svgSkipped: svgSkipped, svgSuppressed: svgSuppressed})
      .replace(/</g, '&lt;') + '</pre>';
});
</script>
</body>"""

# --- ④ 期待テキストの抽出 ------------------------------------------------
EXPECT_JS = """
<script>
window.addEventListener('load', function () {
  var pages = {};
  document.querySelectorAll('section.slide').forEach(function (sec, i) {
    var p = sec.querySelector('.s-page');
    var key = 'p' + ('0' + i).slice(-2) + '_' + (p ? p.textContent.trim() : 'cover');
    var arr = [];
    sec.querySelectorAll('*').forEach(function (el) {
      if (el.children.length === 0) {
        var t = el.textContent.replace(/\\s+/g, '');
        if (t) arr.push(t);
      }
    });
    pages[key] = arr;
  });
  document.body.innerHTML = '<pre id="D">' +
    JSON.stringify(pages).replace(/</g, '&lt;') + '</pre>';
});
</script>
</body>"""

PAGE_STYLE = ('<style>body{background:#fff;margin:0}'
              '.slide{margin:0!important;box-shadow:none!important}</style>')


def find_chrome():
    for p in CHROME_CANDIDATES:
        if os.path.exists(p):
            return p
    raise SystemExit("Chrome / Edge が見つかりません。CHROME_CANDIDATES を確認してください。")


def prepare(src_html, workdir):
    workdir = os.path.abspath(workdir)
    try:
        workdir.encode("ascii")
    except UnicodeEncodeError:
        raise SystemExit(
            "workdir に非ASCII文字が含まれています。file:/// で読めないため、\n"
            "スクラッチパッド配下などASCIIのパスを指定してください。\n  " + workdir)
    os.makedirs(workdir, exist_ok=True)
    css_src = os.path.join(os.path.dirname(os.path.abspath(src_html)), "css")
    if os.path.isdir(css_src):
        css_dst = os.path.join(workdir, "css")
        if os.path.isdir(css_dst):
            shutil.rmtree(css_dst)
        shutil.copytree(css_src, css_dst)
    return workdir, io.open(src_html, encoding="utf-8").read()


def run_probe(workdir, html, js, name):
    """probe用HTMLを作ってChromeで実行し、<pre id="D"> のJSONを返す。"""
    import html as htmlmod
    path = os.path.join(workdir, name)
    io.open(path, "w", encoding="utf-8").write(html.replace("</body>", js))
    out = subprocess.run(
        [find_chrome(), "--headless=new", "--disable-gpu", "--virtual-time-budget=6000",
         "--window-size=1400,900", "--dump-dom", "file:///" + path.replace("\\", "/")],
        capture_output=True, text=True, encoding="utf-8", errors="replace").stdout
    m = re.search(r'<pre id="D">(.*?)</pre>', out, re.S)
    if not m:
        raise SystemExit("probe の出力を取得できませんでした。Chrome の実行を確認してください。")
    return json.loads(htmlmod.unescape(m.group(1)))


def split_sections(html):
    return re.findall(r'(<section class="slide.*?</section>)', html, re.S)


def page_keys(html):
    keys = []
    for i, sec in enumerate(split_sections(html)):
        m = re.search(r'<div class="s-page">(.*?)</div>', sec, re.S)
        label = re.sub(r"<[^>]+>", "", m.group(1)).strip() if m else "cover"
        keys.append("p%02d_%s" % (i, label))
    return keys


def cmd_fit(src_html, workdir):
    workdir, html = prepare(src_html, workdir)
    res = run_probe(workdir, html, FIT_JS, "probe_fit.html")
    flags = res["flags"]
    if not flags:
        print("① 箱のはみ出し: 0件")
    else:
        print("=== ① 箱のはみ出し ===")
        print("ページ\t種別\t要素\tはみ出し量\t中身（先頭24字）")
        for f in flags:
            print(f)
        print("--- 検出: %d 件 ---" % len(flags))
        print("  CLIP  = overflow が hidden/clip → 文字が切れる")
        print("  SPILL = overflow が visible     → 箱の外へあふれ、隣と重なる")
        print("  OUT   = 要素がスライドの枠から出ている")

    # 🔴 黙って捨てない。外した件数と、外さなければ出ていた中身を必ず見せる。
    print("\n--- SVG内 %d件を箱の判定から除外（Chromeが位置の値を返すため。README参照）---"
          % res["svgSkipped"])
    sup = res["svgSuppressed"]
    if sup:
        print("  うち %d件は、除外しなければ報告されていました:" % len(sup))
        for s in sup:
            print("   ", s)
        print("  ⚠️ これらは偽陽性と判断して外しています。")
        print("     SVGが本当に崩れていないかは、②の画像で目視して確認してください。")
    print("  ※ SVG内の要素も OUT（スライドの枠から出ている）は従来どおり判定しています。")

    # 🔴 終了コードは常に 0 になる（main が値を返さない）。
    #    「exit 0 だから0件」と読み違えられないよう、合否を最後に必ず言い切る。
    if flags:
        print("")
        print("🔴 ① は未通過です（%d件）。直して ① からやり直してください。" % len(flags))
    else:
        print("")
        print("① 0件。⚠️ ただし重なり・改行崩れ・可読性は出ません。② 画像化へ進んでください。")
    return len(flags)


def cmd_shots(src_html, workdir):
    workdir, html = prepare(src_html, workdir)
    secs = split_sections(html)
    keys = page_keys(html)
    head = re.search(r"<head>(.*?)</head>", html, re.S).group(1)
    chrome = find_chrome()
    for key, sec in zip(keys, secs):
        page_html = os.path.join(workdir, key + ".html")
        io.open(page_html, "w", encoding="utf-8").write(
            '<!doctype html><html lang="ja"><head>' + head + PAGE_STYLE +
            "</head><body>" + sec + "</body></html>")
        subprocess.run(
            [chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars",
             "--force-device-scale-factor=1", "--window-size=1280,720",
             "--default-background-color=FFFFFFFF", "--virtual-time-budget=4000",
             "--screenshot=" + os.path.join(workdir, key + ".png"),
             "file:///" + page_html.replace("\\", "/")],
            capture_output=True)
    os.makedirs(os.path.join(workdir, "seen"), exist_ok=True)
    print("② %d ページを画像化しました: %s" % (len(keys), workdir))
    for k in keys:
        print("  ", k + ".png")
    print("\n③ 次: 画像を1枚ずつ開き、**見えたとおりに** seen/<同じ名前>.txt へ書き出す。")
    print("   途中で切れていたら、切れたところまでを書く（補完しない）。")
    print("   🔴 このとき expected.json を開かない。全ページ終わるまで expect を実行しない。")


def cmd_expect(src_html, workdir):
    workdir, html = prepare(src_html, workdir)
    keys = page_keys(html)
    seen_dir = os.path.join(workdir, "seen")
    done = [k for k in keys if os.path.exists(os.path.join(seen_dir, k + ".txt"))]
    if len(done) < len(keys):
        print("⚠️ 転記が終わっていないページがあります（%d / %d）。" % (len(done), len(keys)))
        print("   🔴 期待値を先に出すと、転記が期待に引きずられます。")
        print("   未転記:", ", ".join(k for k in keys if k not in done))
        print("   それでも実行する場合は、転記済みのページだけを diff の対象にしてください。")
    pages = run_probe(workdir, html, EXPECT_JS, "probe_expect.html")
    io.open(os.path.join(workdir, "expected.json"), "w", encoding="utf-8").write(
        json.dumps(pages, ensure_ascii=False, indent=1))
    print("④ expected.json を作成: %d ページ" % len(pages))


def norm(t):
    t = unicodedata.normalize("NFKC", t)
    t = re.sub(r"[\s\u3000]", "", t)
    # 🔴 絵文字の異体字セレクタ（U+FE0F）を落とす。
    #    「⚠️」は ⚠(U+26A0)+U+FE0F の2文字。画像から書き起こすと U+FE0F が付かないため、
    #    そのままでは必ず不一致になり、しかも「⚠」で分断された偽の欠落が出る。
    t = t.replace("️", "").replace("︎", "")
    # 罫線・箇条書きの記号ゆれ（画像から読み取ると形が変わりやすい）
    for a, b in [("～", "〜"), ("－", "-"), ("―", "-"), ("‐", "-"), ("−", "-"),
                 ("—", "-"), ("ー", "-"), ("･", "・"), ("▪", "■"), ("●", "■")]:
        t = t.replace(a, b)
    return t


def cmd_diff(workdir):
    workdir = os.path.abspath(workdir)
    path = os.path.join(workdir, "expected.json")
    if not os.path.exists(path):
        raise SystemExit("expected.json がありません。先に expect を実行してください。")
    pages = json.load(io.open(path, encoding="utf-8"))
    ng = 0
    for key, frags in pages.items():
        seen_path = os.path.join(workdir, "seen", key + ".txt")
        if not os.path.exists(seen_path):
            print("[未転記] %s — 画像をまだ読み取っていません" % key)
            ng += 1
            continue
        seen = norm(io.open(seen_path, encoding="utf-8").read())
        for f in frags:
            nf = norm(f)
            if nf in seen:
                continue
            k = 0
            for i in range(len(nf), 3, -1):
                if nf[:i] in seen:
                    k = i
                    break
            if k:
                print("[途中で切れている] %s\n    表示: 「%s」\n    欠落: 「%s」" % (key, f[:k], f[k:]))
            else:
                print("[まるごと見えない] %s\n    期待: 「%s」" % (key, f))
            ng += 1
    print("--- 不一致: %d 件 ---" % ng)
    if ng:
        print("⚠️ 直す前に、そのページの画像をもう一度開いて確認すること。")
        print("   転記は人手なので、転記ミスで偽の不一致が出ます。")
    return ng


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    cmd = sys.argv[1]
    if cmd == "fit":
        cmd_fit(sys.argv[2], sys.argv[3])
    elif cmd == "shots":
        cmd_shots(sys.argv[2], sys.argv[3])
    elif cmd == "expect":
        cmd_expect(sys.argv[2], sys.argv[3])
    elif cmd == "diff":
        return 1 if cmd_diff(sys.argv[2]) else 0
    else:
        print(__doc__)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
