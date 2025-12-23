/**
 * Jest環境確認用サンプルテスト
 *
 * 目的: Jest環境が正しくセットアップされていることを確認
 * テストID: UT-U-CMN-000
 */

describe('Jest環境確認', () => {
  describe('基本機能', () => {
    it('UT-U-CMN-000-01: 基本的なテストが動作する', () => {
      expect(1 + 1).toBe(2);
    });

    it('UT-U-CMN-000-02: 配列のマッチャーが動作する', () => {
      const items = ['apple', 'banana', 'cherry'];
      expect(items).toHaveLength(3);
      expect(items).toContain('banana');
    });

    it('UT-U-CMN-000-03: オブジェクトのマッチャーが動作する', () => {
      const todo = {
        id: 1,
        title: 'テストタスク',
        completed: false
      };
      expect(todo).toHaveProperty('title', 'テストタスク');
      expect(todo.completed).toBeFalsy();
    });
  });

  describe('jsdom環境', () => {
    it('UT-U-CMN-000-04: DOM操作が動作する', () => {
      document.body.innerHTML = '<div id="test">Hello Jest</div>';
      const element = document.getElementById('test');
      expect(element).not.toBeNull();
      expect(element?.textContent).toBe('Hello Jest');
    });

    it('UT-U-CMN-000-05: イベントリスナーが動作する', () => {
      document.body.innerHTML = '<button id="btn">Click me</button>';
      const button = document.getElementById('btn') as HTMLButtonElement;
      let clicked = false;

      button.addEventListener('click', () => {
        clicked = true;
      });

      button.click();
      expect(clicked).toBe(true);
    });

    it('UT-U-CMN-000-06: フォーム入力が動作する', () => {
      document.body.innerHTML = '<input type="text" id="input" />';
      const input = document.getElementById('input') as HTMLInputElement;

      input.value = 'テスト入力';
      expect(input.value).toBe('テスト入力');
    });
  });

  describe('モック機能', () => {
    it('UT-U-CMN-000-07: 関数モックが動作する', () => {
      const mockFn = jest.fn();
      mockFn('arg1', 'arg2');

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('UT-U-CMN-000-08: モック戻り値が動作する', () => {
      const mockFn = jest.fn().mockReturnValue('mocked value');
      const result = mockFn();

      expect(result).toBe('mocked value');
    });

    it('UT-U-CMN-000-09: 非同期モックが動作する', async () => {
      const mockAsync = jest.fn().mockResolvedValue({ data: 'test' });
      const result = await mockAsync();

      expect(result).toEqual({ data: 'test' });
    });
  });

  describe('タイマーモック', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('UT-U-CMN-000-10: setTimeoutモックが動作する', () => {
      const callback = jest.fn();
      setTimeout(callback, 1000);

      expect(callback).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);

      expect(callback).toHaveBeenCalled();
    });
  });
});
