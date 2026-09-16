# -*- coding: utf-8 -*-
"""HTML を Chrome headless で撮り、背景色の余白を切り落として PNG にする。
   使い方: python render_png.py <入力.html> <出力.png> [幅] [高さ]
"""
import os, subprocess, sys, tempfile
from PIL import Image

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

src = os.path.abspath(sys.argv[1])
dst = os.path.abspath(sys.argv[2])
w = int(sys.argv[3]) if len(sys.argv) > 3 else 1300
h = int(sys.argv[4]) if len(sys.argv) > 4 else 2400

tmp = os.path.join(tempfile.gettempdir(), "_shot_%d.png" % os.getpid())
subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                "--force-device-scale-factor=1",
                "--window-size=%d,%d" % (w, h),
                "--screenshot=" + tmp,
                "file:///" + src.replace("\\", "/")],
               check=True, capture_output=True)

im = Image.open(tmp).convert("RGB")
bg = im.getpixel((2, 2))                      # 台紙の色
px = im.load()
W, H = im.size

def row_is_bg(y):
    return all(px[x, y] == bg for x in range(0, W, 3))

def col_is_bg(x):
    return all(px[x, y] == bg for y in range(0, H, 3))

top = 0
while top < H - 1 and row_is_bg(top):
    top += 1
bot = H - 1
while bot > top and row_is_bg(bot):
    bot -= 1
left = 0
while left < W - 1 and col_is_bg(left):
    left += 1
right = W - 1
while right > left and col_is_bg(right):
    right -= 1

im.crop((left, top, right + 1, bot + 1)).save(dst)
os.remove(tmp)
print(dst, Image.open(dst).size)
