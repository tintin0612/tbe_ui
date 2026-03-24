@echo off
chcp 65001 >nul
echo.
echo ===============================================
echo     Tbe UI 文档站点启动脚本
echo ===============================================
echo.
echo [信息] 正在启动本地文档服务器...
echo [信息] 请稍候，服务器正在启动中...
echo.

python -m http.server 5173

echo.
echo ===============================================
echo     服务器已启动完成！
echo ===============================================
echo.
echo [访问地址] http://localhost:5173
echo [使用说明] 请在浏览器中打开上述地址访问文档
echo [停止服务] 按 Ctrl+C 停止服务器
echo.
echo ===============================================
echo.
echo [免费素材站] https://sc.bitehe.com
echo [UI文档] https://ui.bitehe.com
pause