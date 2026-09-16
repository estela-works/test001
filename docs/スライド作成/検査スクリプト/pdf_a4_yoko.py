# -*- coding: utf-8 -*-
"""16:9 のスライドPDFを、A4横のPDFへ載せ替える。

なぜ要るか（2026/8/30）:
  スライドは 1280x720px = 13.333in x 7.5in（PowerPoint 既定の16:9）で作る。
  Chrome の「PDFに保存」は @page の指定どおり、この変則サイズで出力する。
  画面で見るぶんには正しいが、**A4 を前提にしたビューアや印刷設定では
  縦A4に縮小して収めようとするため、小さく・縦長に見える**。
  相手へ紙で渡す・先方が印刷する場合は、A4横に載せ替えておくと確実。

使い方:
    python pdf_a4_yoko.py <入力.pdf> [出力.pdf]
    （出力を省略すると <入力>_A4横.pdf）

やっていること:
  元ページの縦横比を保ったまま、A4横（842 x 595pt）の中央へ最大で収める。
  16:9 を A4横（約1.414:1）へ載せるため、上下に白い帯が入る。これは正しい挙動。
"""
import os
import sys

import fitz  # PyMuPDF


def to_a4_landscape(src_path: str, dst_path: str) -> int:
    src = fitz.open(src_path)
    out = fitz.open()
    a4w, a4h = fitz.paper_size("a4-l")  # 842 x 595 pt
    for i in range(src.page_count):
        r = src[i].rect
        s = min(a4w / r.width, a4h / r.height)
        w, h = r.width * s, r.height * s
        x, y = (a4w - w) / 2, (a4h - h) / 2
        page = out.new_page(width=a4w, height=a4h)
        page.show_pdf_page(fitz.Rect(x, y, x + w, y + h), src, i)
    out.save(dst_path, deflate=True, garbage=4)
    n = out.page_count
    out.close()
    src.close()
    return n


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    src = os.path.abspath(sys.argv[1])
    if len(sys.argv) > 2:
        dst = os.path.abspath(sys.argv[2])
    else:
        stem, ext = os.path.splitext(src)
        dst = stem + "_A4横" + ext
    n = to_a4_landscape(src, dst)
    print("%s → %s（%dページ・A4横 842x595pt）" % (os.path.basename(src), os.path.basename(dst), n))


if __name__ == "__main__":
    main()
