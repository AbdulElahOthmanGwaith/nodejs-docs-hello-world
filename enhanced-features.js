// التحسينات المتقدمة لـ ConnectHub
// Enhanced Features for ConnectHub

class ConnectHubEnhancer {
    constructor() {
        this.isDarkMode = false;
        this.voiceWaveform = null;
        this.notificationPermission = false;
        this.isOnline = navigator.onLine;
        this.setupEventListeners();
        this.initializeEnhancements();
    }

    // إعداد المستمعين للأحداث
    setupEventListeners() {
        // مراقبة حالة الاتصال بالإنترنت
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showNetworkStatus(true);
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showNetworkStatus(false);
        });

        // تحسين التنقل بلوحة المفاتيح
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // تحسين التركيز
        document.addEventListener('focusin', (e) => {
            this.enhanceFocus(e.target);
        });
    }

    // تهيئة التحسينات
    async initializeEnhancements() {
        await this.requestNotificationPermission();
        this.initializeDarkMode();
        this.enhanceVoiceRecording();
        this.improveAccessibility();
        this.addPerformanceOptimizations();
        this.setupNetworkStatus();
    }

    // طلب إذن الإشعارات
    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            this.notificationPermission = permission === 'granted';
            
            if (this.notificationPermission) {
                console.log('✅ تم تفعيل الإشعارات');
                this.showNotification('مرحباً بك في ConnectHub!', {
                    body: 'ستتلقى إشعارات الأصدقاء والمنشورات الجديدة',
                    icon: '🌐'
                });
            }
        }
    }

    // تهيئة الوضع المظلم
    initializeDarkMode() {
        // تحميل تفضيل الوضع المظلم من التخزين المحلي
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        
        if (savedDarkMode) {
            this.toggleDarkMode(true);
        }

        // إضافة زر تبديل الوضع المظلم
        this.addDarkModeToggle();
    }

    // إضافة زر تبديل الوضع المظلم
    addDarkModeToggle() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const darkModeBtn = document.createElement('div');
        darkModeBtn.className = 'nav-icon dark-mode-toggle';
        darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        darkModeBtn.title = 'تبديل الوضع المظلم';
        darkModeBtn.setAttribute('aria-label', 'تبديل الوضع المظلم');
        darkModeBtn.tabIndex = 0;
        
        darkModeBtn.addEventListener('click', () => {
            this.toggleDarkMode();
        });

        darkModeBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleDarkMode();
            }
        });

        // إضافة الزر إلى شريط التنقل
        const navRight = navbar.querySelector('.nav-right');
        if (navRight) {
            navRight.insertBefore(darkModeBtn, navRight.firstChild);
        }
    }

    // تبديل الوضع المظلم
    toggleDarkMode(force = null) {
        this.isDarkMode = force !== null ? force : !this.isDarkMode;
        
        document.body.classList.toggle('dark-mode', this.isDarkMode);
        
        // حفظ التفضيل
        localStorage.setItem('darkMode', this.isDarkMode);
        
        // تحديث أيقونة الزر
        const toggleBtn = document.querySelector('.dark-mode-toggle i');
        if (toggleBtn) {
            toggleBtn.className = this.isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        }

        // إشعار المستخدم
        const modeText = this.isDarkMode ? 'الوضع المظلم' : 'الوضع الفاتح';
        this.showNotification(`تم تفعيل ${modeText}`, {
            body: 'يمكنك تغيير هذا الإعداد في أي وقت',
            silent: true
        });
    }

    // تحسين تسجيل الصوت مع عرض الموجات
    enhanceVoiceRecording() {
        // إضافة عنصر عرض الموجات الصوتية
        const voiceRecordingContainer = document.querySelector('.voice-recording-container');
        if (voiceRecordingContainer) {
            const waveformContainer = document.createElement('div');
            waveformContainer.className = 'voice-waveform-container';
            waveformContainer.innerHTML = `
                <canvas class="voice-waveform" width="300" height="50"></canvas>
                <div class="waveform-instructions">${getCurrentTranslation('hold_to_record') || 'اضغط مع الاستمرار للتسجيل'}</div>
            `;
            voiceRecordingContainer.appendChild(waveformContainer);
        }

        // تحسين إدارة التسجيل
        this.enhanceMediaRecorder();
    }

    // تحسين MediaRecorder API
    enhanceMediaRecorder() {
        const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
        
        navigator.mediaDevices.getUserMedia = async function(constraints) {
            try {
                const stream = await originalGetUserMedia.call(this, constraints);
                
                // إضافة مؤثرات بصرية للتسجيل
                if (stream.getAudioTracks().length > 0) {
                    // إنشاء فنان الصوت للموجات
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const analyser = audioContext.createAnalyser();
                    const source = audioContext.createMediaStreamSource(stream);
                    
                    analyser.fftSize = 256;
                    source.connect(analyser);
                    
                    // تخزين المرجع للاستخدام في الرسم
                    window.audioAnalyser = analyser;
                }
                
                return stream;
            } catch (error) {
                console.error('خطأ في الوصول للميكروفون:', error);
                throw error;
            }
        };
    }

    // تحسين إمكانية الوصول
    improveAccessibility() {
        // إضافة ARIA labels
        this.addAriaLabels();
        
        // تحسين التنقل بلوحة المفاتيح
        this.enhanceKeyboardNavigation();
        
        // إضافة أوصاف بديلة للصور
        this.enhanceAltTexts();
        
        // تحسين التباين
        this.enhanceContrast();
    }

    // إضافة ARIA labels
    addAriaLabels() {
        // أزرار التنقل
        const navIcons = document.querySelectorAll('.nav-icon');
        navIcons.forEach((icon, index) => {
            const labels = [
                'الصفحة الرئيسية',
                'الأصدقاء',
                'الفيديو المباشر',
                'المتجر',
                'المجموعات'
            ];
            
            if (labels[index]) {
                icon.setAttribute('aria-label', labels[index]);
                icon.setAttribute('role', 'button');
            }
        });

        // أزرار الإجراءات
        const actionButtons = document.querySelectorAll('button');
        actionButtons.forEach(button => {
            if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
                button.setAttribute('aria-label', 'زر إجراء');
            }
        });
    }

    // تحسين التنقل بلوحة المفاتيح
    enhanceKeyboardNavigation() {
        // التركيز الأولي على العنصر الأول
        if (!document.activeElement || document.activeElement === document.body) {
            const firstInteractive = document.querySelector('button, [tabindex]:not([tabindex="-1"])');
            if (firstInteractive) {
                firstInteractive.focus();
            }
        }

        // مؤشر التركيز المرئي
        const style = document.createElement('style');
        style.textContent = `
            *:focus {
                outline: 2px solid #667eea !important;
                outline-offset: 2px !important;
            }
            
            .keyboard-nav *:focus {
                box-shadow: 0 0 0 2px #667eea, 0 0 0 4px rgba(102, 126, 234, 0.3) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // معالجة التنقل بلوحة المفاتيح
    handleKeyboardNavigation(e) {
        // Ctrl + D للوضع المظلم
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            this.toggleDarkMode();
        }

        // Escape لإغلاق النوافذ المنبثقة
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal, .popup');
            modals.forEach(modal => {
                if (modal.style.display !== 'none') {
                    modal.style.display = 'none';
                }
            });
        }

        // Ctrl + / للمساعدة
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            this.showKeyboardShortcuts();
        }
    }

    // تحسين التباين
    enhanceContrast() {
        // إضافة CSS للتباين العالي
        const contrastStyle = document.createElement('style');
        contrastStyle.textContent = `
            @media (prefers-contrast: high) {
                .login-box,
                .signup-box,
                .post-card,
                .friend-card {
                    border: 2px solid #000;
                    background: #fff;
                    color: #000;
                }
                
                .nav-icon:hover {
                    background-color: #000;
                    color: #fff;
                }
            }
        `;
        document.head.appendChild(contrastStyle);
    }

    // تحسينات الأداء
    addPerformanceOptimizations() {
        // تحسين الصور
        this.optimizeImages();
        
        // تحسين JavaScript
        this.optimizeJavaScript();
        
        // تحسين CSS
        this.optimizeCSS();
    }

    // تحسين الصور
    optimizeImages() {
        // ضغط وتحسين الصور
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.src.startsWith('https://via.placeholder.com')) {
                // تحسين صور العنصر النائبة
                img.loading = 'lazy';
                img.decoding = 'async';
                
                // إضافة خوارزمية التحميل التدريجي
                img.addEventListener('load', function() {
                    this.style.opacity = '1';
                    this.style.transition = 'opacity 0.3s ease';
                });
            }
        });
    }

    // تحسين JavaScript
    optimizeJavaScript() {
        // تحسين DOM queries
        this.cacheElements();
        
        // تحسين Event Listeners
        this.optimizeEventListeners();
        
        // تحسين الذاكرة
        this.optimizeMemory();
    }

    // تخزين العناصر للوصول السريع
    cacheElements() {
        this.cachedElements = {
            navbar: document.querySelector('.navbar'),
            mainPage: document.getElementById('mainPage'),
            postsContainer: document.querySelector('.posts-container'),
            friendsContainer: document.querySelector('.friends-container'),
            notificationsContainer: document.querySelector('.notifications-container')
        };
    }

    // تحسين المستمعين للأحداث
    optimizeEventListeners() {
        // استخدام Event Delegation
        document.addEventListener('click', (e) => {
            this.handleClickOptimized(e);
        });
    }

    // تحسين الذاكرة
    optimizeMemory() {
        // تنظيف البيانات غير المستخدمة
        setInterval(() => {
            this.cleanupUnusedData();
        }, 300000); // كل 5 دقائق
    }

    // إعدادات حالة الشبكة
    setupNetworkStatus() {
        this.createNetworkStatusIndicator();
        
        // تحديث حالة الشبكة كل 30 ثانية
        setInterval(() => {
            this.updateNetworkStatus();
        }, 30000);
    }

    // إنشاء مؤشر حالة الشبكة
    createNetworkStatusIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'network-status-indicator';
        indicator.innerHTML = `
            <div class="network-status ${this.isOnline ? 'online' : 'offline'}">
                <i class="fas ${this.isOnline ? 'fa-wifi' : 'fa-wifi-slash'}"></i>
                <span>${this.isOnline ? 'متصل' : 'غير متصل'}</span>
            </div>
        `;
        
        // إضافة CSS للمؤشر
        const style = document.createElement('style');
        style.textContent = `
            .network-status-indicator {
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 10000;
                transition: all 0.3s ease;
            }
            
            .network-status {
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .network-status.online {
                background: #10b981;
                color: white;
            }
            
            .network-status.offline {
                background: #ef4444;
                color: white;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(indicator);
    }

    // عرض حالة الشبكة
    showNetworkStatus(isOnline) {
        const indicator = document.querySelector('.network-status-indicator');
        if (indicator) {
            const status = indicator.querySelector('.network-status');
            const icon = status.querySelector('i');
            const text = status.querySelector('span');
            
            status.className = `network-status ${isOnline ? 'online' : 'offline'}`;
            icon.className = `fas ${isOnline ? 'fa-wifi' : 'fa-wifi-slash'}`;
            text.textContent = isOnline ? 'متصل' : 'غير متصل';
            
            // إخفاء المؤشر بعد 3 ثواني إذا كان متصل
            if (isOnline) {
                setTimeout(() => {
                    indicator.style.opacity = '0';
                    setTimeout(() => {
                        indicator.style.display = 'none';
                    }, 300);
                }, 3000);
            } else {
                indicator.style.display = 'block';
                indicator.style.opacity = '1';
            }
        }
    }

    // تحسين عرض الإشعارات
    showNotification(title, options = {}) {
        if (this.notificationPermission && 'Notification' in window) {
            new Notification(title, {
                icon: options.icon || '🌐',
                body: options.body || '',
                silent: options.silent || false,
                tag: options.tag || 'connecthub-notification',
                requireInteraction: options.requireInteraction || false
            });
        }
    }

    // تحسينات إضافية
    addProgressiveWebAppFeatures() {
        // إضافة Web App Manifest
        this.createAppManifest();
        
        // إضافة Service Worker للوضع المتصل
        this.createServiceWorker();
    }

    // إنشاء App Manifest
    createAppManifest() {
        const manifest = {
            name: "ConnectHub - منصة التواصل الاجتماعي المتقدمة",
            short_name: "ConnectHub",
            description: "منصة تواصل اجتماعي حديثة ومبتكرة",
            start_url: "/",
            display: "standalone",
            background_color: "#f0f2f5",
            theme_color: "#667eea",
            orientation: "portrait-primary",
            icons: [
                {
                    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='192' viewBox='0 0 24 24'%3E%3Cpath fill='%23667eea' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E",
                    sizes: "192x192",
                    type: "image/svg+xml"
                }
            ]
        };

        const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
        const manifestUrl = URL.createObjectURL(manifestBlob);
        
        const manifestLink = document.createElement('link');
        manifestLink.rel = 'manifest';
        manifestLink.href = manifestUrl;
        document.head.appendChild(manifestLink);
    }

    // إنشاء Service Worker
    createServiceWorker() {
        if ('serviceWorker' in navigator) {
            const swCode = `
                const CACHE_NAME = 'connecthub-v1';
                const urlsToCache = [
                    '/',
                    '/styles.css',
                    '/script.js',
                    '/translations.js'
                ];

                self.addEventListener('install', (event) => {
                    event.waitUntil(
                        caches.open(CACHE_NAME)
                            .then((cache) => cache.addAll(urlsToCache))
                    );
                });

                self.addEventListener('fetch', (event) => {
                    event.respondWith(
                        caches.match(event.request)
                            .then((response) => {
                                // إرجاع النسخة المخزنة إذا كانت متوفرة
                                if (response) {
                                    return response;
                                }
                                return fetch(event.request);
                            })
                    );
                });
            `;

            const swBlob = new Blob([swCode], { type: 'application/javascript' });
            const swUrl = URL.createObjectURL(swBlob);
            
            navigator.serviceWorker.register(swUrl)
                .then((registration) => {
                    console.log('✅ تم تسجيل Service Worker بنجاح');
                })
                .catch((error) => {
                    console.log('❌ فشل في تسجيل Service Worker:', error);
                });
        }
    }

    // عرض اختصارات لوحة المفاتيح
    showKeyboardShortcuts() {
        const shortcuts = `
اختصارات لوحة المفاتيح في ConnectHub:

الأساسي:
• Ctrl + D - تبديل الوضع المظلم
• Escape - إغلاق النوافذ المنبثقة
• Ctrl + / - عرض هذه المساعدة

التنقل:
• Tab - التنقل للأمام
• Shift + Tab - التنقل للخلف
• Enter/Space - تفعيل العنصر

الوصول:
• Alt + S - التركيز على البحث
• Alt + N - التركيز على الإشعارات
• Alt + P - التركيز على الملف الشخصي
        `;

        alert(shortcuts);
    }
}

// تشغيل التحسينات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.connectHubEnhancer = new ConnectHubEnhancer();
});

// تصدير للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConnectHubEnhancer;
}