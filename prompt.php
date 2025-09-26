<?php
    // --- SERVER-SIDE DATA FETCHING ---
    $prompt_id = '';
    $prompt_content = null;
    $error_message = null;
    $is_direct_view = false;

    if (isset($_GET['id']) && !empty($_GET['id'])) {
        $prompt_id = htmlspecialchars($_GET['id']);
        $is_direct_view = true;
        
        $google_script_url = 'https://script.google.com/macros/s/AKfycbzkFZRlwWxHslIWrDrzV2E8E5O_vhP5pkvlosppHltMVefvJjGwTdfXIoJS-oOYOhdv/exec?id=' . urlencode($prompt_id);
        
        // Use @ to suppress warnings on failure, we'll handle it manually
        $response_json = @file_get_contents($google_script_url);

        if ($response_json === false) {
            $error_message = 'ไม่สามารถเชื่อมต่อกับฐานข้อมูลเพื่อดึงข้อมูล Prompt ได้';
        } else {
            $data = json_decode($response_json, true);
            if (isset($data['status']) && $data['status'] === 'success' && isset($data['code'])) {
                $prompt_content = $data['code'];
            } else {
                $error_message = isset($data['message']) ? $data['message'] : 'เกิดข้อผิดพลาด: ไม่พบข้อมูล Prompt หรือการตอบกลับไม่ถูกต้อง';
            }
        }
    }
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prompt Sharer - ระบบแชร์ Prompt</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Sarabun', sans-serif; }
        pre::-webkit-scrollbar { height: 8px; }
        pre::-webkit-scrollbar-track { background: #2d3748; }
        pre::-webkit-scrollbar-thumb { background: #718096; border-radius: 4px; }
        pre::-webkit-scrollbar-thumb:hover { background: #a0aec0; }
        .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body class="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4">

    <div class="w-full max-w-2xl mx-auto">
        <div id="main-container" class="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg space-y-6">
            <h1 id="main-title" class="text-2xl md:text-3xl font-bold text-gray-800 text-center">
                <?php echo $is_direct_view ? 'Prompt สำหรับคัดลอก' : 'ระบบดึงข้อมูล Prompt'; ?>
            </h1>

            <?php if (!$is_direct_view): ?>
                <!-- ADMIN VIEW: Shown only when no ID is in URL -->
                <div id="form-section">
                    <p class="text-center text-gray-500">ใส่รหัสเพื่อดึงข้อมูล Prompt</p>
                    <div class="mt-4">
                        <label for="idInput" class="block text-sm font-medium text-gray-700 mb-2">รหัส Prompt</label>
                        <input type="text" id="idInput" autocomplete="username" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="เช่น 1001, 1002">
                    </div>
                    <button id="get-code-btn" class="w-full mt-4 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700">
                        ดึงข้อมูล Prompt
                    </button>
                </div>
                <div id="admin-preview-container" class="hidden space-y-4 pt-4 border-t border-gray-200">
                    <div id="admin-loader" class="text-center hidden">
                        <div class="loader"></div>
                        <p class="text-gray-500">กำลังโหลด Prompt...</p>
                    </div>
                    <div id="admin-code-content-js" class="hidden space-y-2">
                        <label class="block text-sm font-medium text-gray-700">ข้อมูล Prompt</label>
                        <button id="admin-copy-code-btn-js" class="w-full mb-2 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700">
                            คัดลอก Prompt
                        </button>
                        <pre class="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm"><code id="admin-code-display-js" class="font-mono"></code></pre>
                    </div>
                    <div id="admin-error-view-js" class="hidden text-center text-red-600 bg-red-100 p-4 rounded-lg">
                        <p id="admin-error-message-js"></p>
                    </div>
                </div>

            <?php else: ?>
                <!-- DIRECT VIEW: Rendered by PHP when ID is in URL -->
                <div class="space-y-4">
                    <?php if ($prompt_content !== null): ?>
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">ข้อมูล Prompt</label>
                            <button id="copy-code-btn-php" class="w-full mb-2 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700">
                                คัดลอก Prompt
                            </button>
                            <pre class="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm"><code id="code-display-php" class="font-mono"><?php echo htmlspecialchars($prompt_content); ?></code></pre>
                        </div>
                    <?php else: ?>
                        <div class="text-center text-red-600 bg-red-100 p-4 rounded-lg">
                            <p><?php echo htmlspecialchars($error_message); ?></p>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        </div>

        <div id="toast" class="fixed bottom-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-xl opacity-0 translate-y-10 transition-all duration-300">
            <span id="toast-message"></span>
        </div>
    </div>

    <footer class="text-center text-gray-500 text-sm py-4 mt-4">
        <a href="https://eduinthai.com/" target="_blank" rel="noopener noreferrer" class="hover:underline">ผู้พัฒนา นายกานตพงศ์ สุวรรณทา</a>
    </footer>

    <script>
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzkFZRlwWxHslIWrDrzV2E8E5O_vhP5pkvlosppHltMVefvJjGwTdfXIoJS-oOYOhdv/exec';
        let toastTimeout;

        function showToast(message) {
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toast-message');
            if (!toast || !toastMessage) return;

            clearTimeout(toastTimeout);
            toastMessage.textContent = message;
            toast.classList.remove('opacity-0', 'translate-y-10');
            toast.classList.add('opacity-100', 'translate-y-0');
            toastTimeout = setTimeout(() => {
                toast.classList.remove('opacity-100', 'translate-y-0');
                toast.classList.add('opacity-0', 'translate-y-10');
            }, 3000);
        }

        async function copyToClipboard(text, buttonElement) {
            try {
                await navigator.clipboard.writeText(text);
                showToast('คัดลอก Prompt สำเร็จ!');
                if (buttonElement) {
                    buttonElement.textContent = 'คัดลอกแล้ว!';
                    setTimeout(() => buttonElement.textContent = 'คัดลอก Prompt', 2000);
                }
            } catch (err) {
                console.error('Failed to copy text: ', err);
                showToast('เกิดข้อผิดพลาดในการคัดลอก');
            }
        }

        // --- Logic for Admin View (when no ID in URL) ---
        const getCodeBtn = document.getElementById('get-code-btn');
        if (getCodeBtn) {
            const idInput = document.getElementById('idInput');
            const adminPreviewContainer = document.getElementById('admin-preview-container');
            const adminLoader = document.getElementById('admin-loader');
            const adminCodeContentJS = document.getElementById('admin-code-content-js');
            const adminCodeDisplayJS = document.getElementById('admin-code-display-js');
            const adminErrorViewJS = document.getElementById('admin-error-view-js');
            const adminErrorMessageJS = document.getElementById('admin-error-message-js');
            const adminCopyBtnJS = document.getElementById('admin-copy-code-btn-js');

            getCodeBtn.addEventListener('click', async () => {
                const codeId = idInput.value.trim();
                if (!codeId) {
                    showToast('กรุณาใส่รหัส Prompt');
                    return;
                }
                
                adminPreviewContainer.classList.remove('hidden');
                adminCodeContentJS.classList.add('hidden');
                adminErrorViewJS.classList.add('hidden');
                adminLoader.classList.remove('hidden');

                try {
                    const response = await fetch(`${GOOGLE_SCRIPT_URL}?id=${codeId}`);
                    if (!response.ok) throw new Error(`Network response was not ok`);
                    const data = await response.json();

                    if (data.status === 'success') {
                        adminCodeDisplayJS.textContent = data.code;
                        adminCodeContentJS.classList.remove('hidden');
                    } else {
                        adminErrorMessageJS.textContent = data.message || 'เกิดข้อผิดพลาด';
                        adminErrorViewJS.classList.remove('hidden');
                    }
                } catch (error) {
                    adminErrorMessageJS.textContent = 'ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้';
                    adminErrorViewJS.classList.remove('hidden');
                } finally {
                    adminLoader.classList.add('hidden');
                }
            });

            adminCopyBtnJS.addEventListener('click', () => {
                copyToClipboard(adminCodeDisplayJS.textContent, adminCopyBtnJS);
            });
        }
        
        // --- Logic for Direct View (when content is rendered by PHP) ---
        const copyBtnPHP = document.getElementById('copy-code-btn-php');
        if (copyBtnPHP) {
            const codeDisplayPHP = document.getElementById('code-display-php');
            copyBtnPHP.addEventListener('click', () => {
                copyToClipboard(codeDisplayPHP.textContent, copyBtnPHP);
            });
        }
    </script>
</body>
</html>

