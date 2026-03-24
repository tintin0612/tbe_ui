/**
 * Tbe UI - JavaScript 组件库
 * 版本: 1.0.0
 * 描述: 为新拟态UI组件提供交互功能
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' 
        ? module.exports = factory() 
        : typeof define === 'function' && define.amd 
        ? define(factory) 
        : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.TbeUI = factory());
}(this, function () {
    'use strict';

    // ==================== 工具函数 ====================
    
    /**
     * 防抖函数
     * @param {Function} fn - 要执行的函数
     * @param {number} delay - 延迟时间（毫秒）
     * @returns {Function}
     */
    function debounce(fn, delay) {
        let timer = null;
        return function (...args) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        };
    }

    /**
     * 节流函数
     * @param {Function} fn - 要执行的函数
     * @param {number} interval - 间隔时间（毫秒）
     * @returns {Function}
     */
    function throttle(fn, interval) {
        let lastTime = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastTime >= interval) {
                lastTime = now;
                fn.apply(this, args);
            }
        };
    }

    /**
     * 检查元素是否在视口内
     * @param {Element} element - DOM元素
     * @returns {boolean}
     */
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }


    // ===============================================
    function printInfo (tip= '🎨 Tbe UI 已加载',link= 'https://ui.bitehe.com',color= '#dc6b82') {
        console.log(
            `%c ${tip} %c ${link}`,
            `color:white;background:${color};padding:5px 0;border-radius: 5px 0 0 5px;`,
            `padding:4px;border:1px solid ${color};border-radius: 0 5px 5px 0;`
        );
    };
    function printSKMCJ() {
    const info = `
    ╔═════════╗
            Tbe UI  
    ╚═════════╝
    `;
    console.log(`%c${info}`, `color: #dc6b82`);
    };
    
    // ==================== Radio 单选框组件 ====================
    
    const Radio = {
        /**
         * 选择 Radio Button 样式（兼容旧版调用方式）
         * @param {HTMLElement} button - 按钮元素
         * @param {string} groupName - 组名
         */
        selectRadioButton(button, groupName) {
            this.selectButton(button, groupName);
        },

        /**
         * 选择 Radio Button 样式
         * @param {HTMLElement} button - 按钮元素
         * @param {string} groupName - 组名
         */
        selectButton(button, groupName) {
            const group = button.parentElement;
            const buttons = group.querySelectorAll('.t-radio-button');
            
            buttons.forEach(btn => {
                btn.classList.remove('is-active');
                btn.setAttribute('aria-checked', 'false');
            });
            
            button.classList.add('is-active');
            button.setAttribute('aria-checked', 'true');
            
            // 触发自定义事件
            button.dispatchEvent(new CustomEvent('t:radio:change', {
                detail: { value: button.dataset.value, group: groupName }
            }));
        },

        /**
         * 更新 Radio 选中状态
         * @param {HTMLInputElement} radio - radio输入元素
         */
        updateCheckedState(radio) {
            const parent = radio.closest('.t-radio');
            if (parent) {
                const isChecked = radio.checked;
                parent.classList.toggle('is-checked', isChecked);
                parent.setAttribute('aria-checked', isChecked.toString());
                
                // 更新同组其他radio
                if (isChecked && radio.name) {
                    document.querySelectorAll(`input[name="${radio.name}"]`).forEach(r => {
                        if (r !== radio) {
                            const p = r.closest('.t-radio');
                            if (p) {
                                p.classList.remove('is-checked');
                                p.setAttribute('aria-checked', 'false');
                            }
                        }
                    });
                }
            }
        },

        /**
         * 初始化所有 Radio 组件
         */
        init() {
            document.querySelectorAll('.t-radio__input').forEach(radio => {
                this.updateCheckedState(radio);
                
                radio.addEventListener('change', () => {
                    if (radio.name) {
                        document.querySelectorAll(`input[name="${radio.name}"]`).forEach(r => {
                            this.updateCheckedState(r);
                        });
                    } else {
                        this.updateCheckedState(radio);
                    }
                });
            });
        }
    };

    // ==================== Checkbox 多选框组件 ====================
    
    const Checkbox = {
        /**
         * 更新 Checkbox 选中状态
         * @param {HTMLInputElement} checkbox - checkbox输入元素
         */
        updateCheckedState(checkbox) {
            const parent = checkbox.closest('.t-checkbox');
            if (parent && !parent.classList.contains('is-disabled')) {
                const isChecked = checkbox.checked;
                parent.classList.toggle('is-checked', isChecked);
                parent.setAttribute('aria-checked', isChecked.toString());
            }
        },

        /**
         * 切换 Checkbox Button 状态（兼容旧版调用方式）
         * @param {HTMLElement} button - 按钮元素
         */
        toggleCheckboxButton(button) {
            this.toggleButton(button);
        },

        /**
         * 切换 Checkbox Button 状态
         * @param {HTMLElement} button - 按钮元素
         */
        toggleButton(button) {
            if (button.classList.contains('is-disabled')) return;
            const isActive = button.classList.toggle('is-active');
            button.setAttribute('aria-pressed', isActive.toString());
        },

        /**
         * 切换全选状态（兼容旧版调用方式 - checkbox-cities-group）
         */
        toggleCheckAll() {
            // 兼容 checkbox.md 中的全选功能
            const allCheckbox = document.getElementById('checkbox-all-input');
            const cityCheckboxes = document.querySelectorAll('.city-checkbox');
            
            if (allCheckbox && cityCheckboxes.length > 0) {
                const isChecked = allCheckbox.checked;
                cityCheckboxes.forEach(cb => {
                    cb.checked = !isChecked;
                    this.updateCheckedState(cb);
                });
                allCheckbox.checked = !isChecked;
                this.updateCheckedState(allCheckbox);
                return;
            }
            
            // 如果没有找到特定元素，尝试使用通用的全选逻辑
            const allCheckboxEl = document.querySelector('.t-checkbox.is-indeterminate, .t-checkbox[data-check-all]');
            if (allCheckboxEl) {
                const group = allCheckboxEl.closest('.t-checkbox-group');
                if (group) {
                    this.toggleCheckAllBySelector('#' + group.id);
                }
            }
        },

        /**
         * 切换全选状态（通过选择器）
         * @param {string} groupSelector - 分组选择器
         */
        toggleCheckAllBySelector(groupSelector) {
            const allCheckbox = document.querySelector(`${groupSelector} .t-checkbox.is-indeterminate, ${groupSelector} [data-check-all]`);
            if (!allCheckbox) return;
            
            const allInput = allCheckbox.querySelector('input[type="checkbox"]');
            const itemCheckboxes = document.querySelectorAll(`${groupSelector} .t-checkbox:not([data-check-all]) input[type="checkbox"]`);
            
            if (allCheckbox.classList.contains('is-indeterminate')) {
                allCheckbox.classList.remove('is-indeterminate');
            }
            
            allInput.checked = !allInput.checked;
            
            itemCheckboxes.forEach(checkbox => {
                checkbox.checked = allInput.checked;
                this.updateCheckedState(checkbox);
            });
            
            this.updateCheckedState(allInput);
        },

        /**
         * 更新全选状态
         * @param {string} groupSelector - 分组选择器
         */
        updateCheckAllState(groupSelector) {
            const allCheckbox = document.querySelector(`${groupSelector} [data-check-all]`);
            if (!allCheckbox) return;
            
            const allInput = allCheckbox.querySelector('input[type="checkbox"]');
            const itemCheckboxes = document.querySelectorAll(`${groupSelector} .t-checkbox:not([data-check-all]) input[type="checkbox"]`);
            
            const checkedCount = Array.from(itemCheckboxes).filter(cb => cb.checked).length;
            const totalCount = itemCheckboxes.length;
            
            allCheckbox.classList.remove('is-indeterminate');
            
            if (checkedCount === 0) {
                allInput.checked = false;
            } else if (checkedCount === totalCount) {
                allInput.checked = true;
            } else {
                allInput.checked = false;
                allCheckbox.classList.add('is-indeterminate');
            }
            
            this.updateCheckedState(allInput);
        },

        /**
         * 初始化所有 Checkbox 组件
         */
        init() {
            document.querySelectorAll('.t-checkbox__input').forEach(checkbox => {
                this.updateCheckedState(checkbox);
                
                checkbox.addEventListener('change', () => {
                    this.updateCheckedState(checkbox);
                    
                    // 检查是否需要更新全选状态
                    const group = checkbox.closest('[data-checkbox-group]');
                    if (group) {
                        this.updateCheckAllState(`[data-checkbox-group="${group.dataset.checkboxGroup}"]`);
                    }
                });
            });
        }
    };

    // ==================== Input 输入框组件 ====================

    const Input = {
        /**
         * 清空输入框（兼容旧版调用方式）
         * @param {string} inputId - 输入框ID
         */
        clearInput(inputId) {
            this.clear(inputId);
        },

        /**
         * 清空输入框
         * @param {string} inputId - 输入框ID
         */
        clear(inputId) {
            const input = document.getElementById(inputId);
            if (input) {
                input.value = '';
                input.focus();
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        },

        /**
         * 切换密码显示/隐藏
         * @param {string} inputId - 输入框ID
         * @param {HTMLElement} icon - 图标元素
         */
        togglePassword(inputId, icon) {
            const input = document.getElementById(inputId);
            if (input) {
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                if (icon) {
                    icon.textContent = isPassword ? '🙈' : '👁';
                    icon.setAttribute('aria-label', isPassword ? '隐藏密码' : '显示密码');
                }
            }
        },

        /**
         * 文本域自适应高度
         * @param {HTMLTextAreaElement} textarea - 文本域元素
         */
        autoResize(textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        },

        /**
         * 更新字数统计
         * @param {HTMLTextAreaElement} textarea - 文本域元素
         * @param {string} countId - 计数元素ID
         */
        updateCharCount(textarea, countId) {
            const count = textarea.value.length;
            const max = textarea.getAttribute('maxlength');
            const countEl = document.getElementById(countId);
            if (countEl) {
                countEl.textContent = `${count}/${max}`;
                countEl.setAttribute('aria-live', 'polite');
            }
        }
    };

    // ==================== InputNumber 计数器组件 ====================

    const InputNumber = {
        /**
         * 改变数值（兼容旧版调用方式）
         * @param {string} inputId - 输入框ID
         * @param {number} delta - 变化量
         */
        changeNumber(inputId, delta) {
            this.change(inputId, delta);
        },

        /**
         * 改变数值（带步长，兼容旧版调用方式）
         * @param {string} inputId - 输入框ID
         * @param {number} delta - 变化量
         * @param {number} step - 步长
         */
        changeNumberStep(inputId, delta, step) {
            const input = document.getElementById(inputId);
            if (input) {
                input.step = step;
            }
            this.change(inputId, delta);
        },

        /**
         * 改变数值（严格步数模式，兼容旧版调用方式）
         * @param {string} inputId - 输入框ID
         * @param {number} delta - 变化量
         * @param {number} step - 步长
         */
        changeNumberStrict(inputId, delta, step) {
            const input = document.getElementById(inputId);
            if (input) {
                input.step = step;
            }
            this.change(inputId, delta, { strict: true });
        },

        /**
         * 改变数值
         * @param {string} inputId - 输入框ID
         * @param {number} delta - 变化量
         * @param {Object} options - 配置选项
         */
        change(inputId, delta, options = {}) {
            const input = document.getElementById(inputId);
            if (!input) return;

            let value = parseFloat(input.value) || 0;
            const min = parseFloat(input.min);
            const max = parseFloat(input.max);
            const step = parseFloat(input.step) || 1;

            value += delta * step;

            // 检查边界
            if (!isNaN(min) && value < min) value = min;
            if (!isNaN(max) && value > max) value = max;

            // 严格步数模式
            if (options.strict && value % step !== 0) {
                value = Math.round(value / step) * step;
            }

            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    };

    // ==================== Select 选择器组件 ====================

    const Select = {
        /**
         * 切换下拉菜单（兼容旧版调用方式）
         * @param {string} selectId - 选择器ID
         */
        toggleSelect(selectId) {
            this.toggle(selectId);
        },

        /**
         * 清空选择器（兼容旧版调用方式）
         * @param {string} selectId - 选择器ID
         * @param {Event} event - 事件对象
         */
        clearSelect(selectId, event) {
            if (event) {
                event.stopPropagation();
            }
            const select = document.getElementById(selectId);
            if (!select) return;

            const input = select.querySelector('.t-select__input');
            if (input) {
                input.value = '';
                input.removeAttribute('data-value');
            }

            // 清除选中状态
            select.querySelectorAll('.t-select__option').forEach(option => {
                option.classList.remove('is-selected');
                option.setAttribute('aria-selected', 'false');
            });

            // 触发自定义事件
            select.dispatchEvent(new CustomEvent('t:select:clear'));
        },

        /**
         * 切换下拉菜单
         * @param {string} selectId - 选择器ID
         */
        toggle(selectId) {
            const select = document.getElementById(selectId);
            if (!select || select.classList.contains('is-disabled')) return;

            const isOpen = select.classList.contains('is-open');

            // 关闭其他已打开的选择器
            document.querySelectorAll('.t-select.is-open').forEach(s => {
                if (s.id !== selectId) {
                    s.classList.remove('is-open');
                    s.setAttribute('aria-expanded', 'false');
                }
            });

            select.classList.toggle('is-open');
            select.setAttribute('aria-expanded', (!isOpen).toString());

            if (!isOpen) {
                setTimeout(() => {
                    const closeHandler = (e) => {
                        if (!select.contains(e.target)) {
                            select.classList.remove('is-open');
                            select.setAttribute('aria-expanded', 'false');
                            document.removeEventListener('click', closeHandler);
                        }
                    };
                    document.addEventListener('click', closeHandler);
                }, 0);
            }
        },

        /**
         * 选择选项
         * @param {string} selectId - 选择器ID
         * @param {string} value - 选项值
         * @param {string} label - 选项标签（可选）
         */
        selectOption(selectId, value, label) {
            const select = document.getElementById(selectId);
            if (!select) return;

            const input = select.querySelector('.t-select__input');
            const displayLabel = label || value;

            if (input) {
                input.value = displayLabel;
                input.setAttribute('data-value', value);
            }

            // 更新选中状态
            select.querySelectorAll('.t-select__option').forEach(option => {
                const isSelected = option.dataset.value === value || option.textContent === displayLabel;
                option.classList.toggle('is-selected', isSelected);
                option.setAttribute('aria-selected', isSelected.toString());
            });

            select.classList.remove('is-open');
            select.setAttribute('aria-expanded', 'false');

            // 触发自定义事件
            select.dispatchEvent(new CustomEvent('t:select:change', {
                detail: { value, label: displayLabel }
            }));
        }
    };

    // ==================== Dropdown 下拉菜单组件 ====================
    
    const Dropdown = {
        /**
         * 切换下拉菜单
         * @param {string} dropdownId - 下拉菜单ID
         */
        toggle(dropdownId) {
            const dropdown = document.getElementById(dropdownId);
            if (dropdown) {
                const isActive = dropdown.classList.toggle('is-active');
                dropdown.setAttribute('aria-expanded', isActive.toString());
            }
        },

        /**
         * 选择下拉项
         * @param {HTMLElement} item - 选项元素
         * @param {string} value - 选项值
         */
        selectItem(item, value) {
            const dropdown = item.closest('.t-dropdown');
            if (dropdown) {
                dropdown.classList.remove('is-active');
                dropdown.setAttribute('aria-expanded', 'false');
            }
            
            Message.success('选择了：' + value);
            
            // 触发自定义事件
            if (dropdown) {
                dropdown.dispatchEvent(new CustomEvent('t:dropdown:select', {
                    detail: { value }
                }));
            }
        },

        /**
         * 初始化 - 点击外部关闭
         */
        init() {
            document.addEventListener('click', (e) => {
                document.querySelectorAll('.t-dropdown.is-active').forEach(dropdown => {
                    if (!dropdown.contains(e.target)) {
                        dropdown.classList.remove('is-active');
                        dropdown.setAttribute('aria-expanded', 'false');
                    }
                });
            });
        }
    };

    // ==================== Dialog 对话框组件 ====================

    const Dialog = {
        stack: [],
        dragState: {},

        /**
         * 打开对话框
         * @param {string} dialogId - 对话框ID
         * @param {Object} options - 配置选项
         */
        open(dialogId, options = {}) {
            const dialog = document.getElementById(dialogId);
            if (!dialog) return;

            dialog.style.display = 'flex';
            dialog.setAttribute('aria-hidden', 'false');

            // 防止背景滚动
            if (this.stack.length === 0) {
                document.body.style.overflow = 'hidden';
            }

            this.stack.push(dialogId);

            // 检测是否可拖拽
            const draggableDialog = dialog.querySelector('.t-dialog--draggable');
            if (draggableDialog) {
                this.initDraggable(draggableDialog);
            }

            // 聚焦到对话框
            const focusable = dialog.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusable) focusable.focus();

            // 触发自定义事件
            dialog.dispatchEvent(new CustomEvent('t:dialog:open', {
                detail: { dialogId, options }
            }));
        },

        /**
         * 初始化拖拽功能
         * @param {HTMLElement} dialog - 对话框元素
         */
        initDraggable(dialog) {
            const header = dialog.querySelector('.t-dialog__header');
            if (!header || dialog.dataset.draggableInit) return;

            dialog.dataset.draggableInit = 'true';

            header.style.cursor = 'move';

            header.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return;

                const rect = dialog.getBoundingClientRect();
                this.dragState = {
                    isDragging: true,
                    startX: e.clientX,
                    startY: e.clientY,
                    originalLeft: rect.left,
                    originalTop: rect.top
                };

                document.addEventListener('mousemove', this.handleDragMove);
                document.addEventListener('mouseup', this.handleDragEnd);
                e.preventDefault();
            });
        },

        /**
         * 处理拖拽移动
         */
        handleDragMove: (e) => {
            if (!Dialog.dragState.isDragging) return;

            const { startX, startY, originalLeft, originalTop } = Dialog.dragState;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            const dialogs = document.querySelectorAll('.t-dialog--draggable');
            dialogs.forEach(dialog => {
                if (dialog.style.display !== 'none') {
                    dialog.style.position = 'fixed';
                    dialog.style.left = (originalLeft + deltaX) + 'px';
                    dialog.style.top = (originalTop + deltaY) + 'px';
                    dialog.style.margin = '0';
                }
            });
        },

        /**
         * 处理拖拽结束
         */
        handleDragEnd: () => {
            Dialog.dragState = {};
            document.removeEventListener('mousemove', Dialog.handleDragMove);
            document.removeEventListener('mouseup', Dialog.handleDragEnd);
        },

        /**
         * 关闭对话框
         * @param {string} dialogId - 对话框ID
         */
        close(dialogId) {
            const dialog = document.getElementById(dialogId);
            if (!dialog) return;
            
            dialog.style.display = 'none';
            dialog.setAttribute('aria-hidden', 'true');
            
            const index = this.stack.indexOf(dialogId);
            if (index > -1) {
                this.stack.splice(index, 1);
            }
            
            // 恢复背景滚动
            if (this.stack.length === 0) {
                document.body.style.overflow = '';
            }
            
            // 触发自定义事件
            dialog.dispatchEvent(new CustomEvent('t:dialog:close', {
                detail: { dialogId }
            }));
        },

        /**
         * 初始化 - ESC键关闭
         */
        init() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.stack.length > 0) {
                    const topDialog = this.stack[this.stack.length - 1];
                    this.close(topDialog);
                }
            });
        }
    };

    // ==================== Drawer 抽屉组件 ====================

    const Drawer = {
        stack: [],

        open(direction = 'right', options = {}) {
            const size = options.size || '300px';
            let drawer = document.getElementById('t-drawer-' + direction);
            let overlay = document.getElementById('t-drawer-overlay-' + direction);

            if (!drawer) {
                overlay = document.createElement('div');
                overlay.className = 't-drawer-overlay';
                overlay.id = 't-drawer-overlay-' + direction;

                drawer = document.createElement('div');
                drawer.className = 't-drawer t-drawer-' + direction;
                drawer.id = 't-drawer-' + direction;

                const directionTransform = {
                    'right': 'translateX(-100%)',
                    'left': 'translateX(100%)',
                    'top': 'translateY(100%)',
                    'bottom': 'translateY(-100%)'
                };

                drawer.style.cssText = `
                    width: ${direction === 'right' || direction === 'left' ? size : '100%'};
                    height: ${direction === 'top' || direction === 'bottom' ? size : '100%'};
                    transform: ${directionTransform[direction]};
                    transition: transform 0.3s ease;
                `;

                drawer.innerHTML = `
                    <div class="t-drawer-header">
                        <span class="t-drawer-title">${options.title || '标题'}</span>
                        <button class="t-drawer-close" onclick="Drawer.close('${direction}')">×</button>
                    </div>
                    <div class="t-drawer-body">
                        ${options.content || '抽屉内容'}
                    </div>
                    ${options.showFooter ? '<div class="t-drawer-footer">' + (options.footer || '') + '</div>' : ''}
                `;

                overlay.appendChild(drawer);
                document.body.appendChild(overlay);

                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        this.close(direction);
                    }
                });
            }

            setTimeout(() => {
                drawer.style.transform = 'translateX(0) translateY(0)';
                if (overlay) {
                    overlay.classList.add('active');
                }
            }, 10);

            this.stack.push(direction);
        },

        close(direction = 'right') {
            const drawer = document.getElementById('t-drawer-' + direction);
            const overlay = document.getElementById('t-drawer-overlay-' + direction);

            if (drawer) {
                const directionTransform = {
                    'right': 'translateX(-100%)',
                    'left': 'translateX(100%)',
                    'top': 'translateY(100%)',
                    'bottom': 'translateY(-100%)'
                };
                drawer.style.transform = directionTransform[direction];
            }

            if (overlay) {
                overlay.classList.remove('active');
            }

            const index = this.stack.indexOf(direction);
            if (index > -1) {
                this.stack.splice(index, 1);
            }

            setTimeout(() => {
                if (overlay && !overlay.classList.contains('active')) {
                    overlay.remove();
                }
            }, 300);
        }
    };

    // ==================== MessageBox 弹框组件 ====================

    const MessageBox = {
        stack: [],
        defaultOptions: {
            type: 'info',
            title: '提示',
            message: '',
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: true,
            closeOnPressEscape: true,
            showClose: false,
            center: false,
            closeOnClose: false,
            distbeuishCancelAndClose: false,
            inputPlaceholder: '',
            inputPattern: null,
            inputType: 'text',
            inputErrorMessage: '输入的数据不合法!',
            showInput: false,
            customClass: '',
            beforeClose: null,
            callback: null
        },

        /**
         * 显示消息框
         * @param {string|Object} message - 消息内容或选项
         * @param {string} title - 标题
         * @param {Object} options - 配置选项
         * @returns {Promise}
         */
        show(message, title, options = {}) {
            const config = { ...this.defaultOptions };
            
            if (typeof message === 'object') {
                Object.assign(config, message);
            } else {
                config.message = message;
                if (title) config.title = title;
                Object.assign(config, options);
            }

            return new Promise((resolve, reject) => {
                const overlay = document.getElementById('tMessageBoxOverlay');
                const box = document.getElementById('tMessageBox');
                if (!overlay || !box) return;

                const titleEl = document.getElementById('tMessageBoxTitle');
                const messageEl = document.getElementById('tMessageBoxMessage');
                const iconEl = document.getElementById('tMessageBoxIcon');
                const btnsEl = document.getElementById('tMessageBoxBtns');
                const confirmBtn = document.getElementById('tMessageBoxConfirm');
                const cancelBtn = document.getElementById('tMessageBoxCancel');

                titleEl.textContent = config.title;
                
                if (config.dangerouslyUseHTMLString) {
                    messageEl.innerHTML = config.message;
                } else {
                    messageEl.textContent = config.message;
                }

                const typeIcons = {
                    success: '✓',
                    warning: '⚠',
                    error: '✕',
                    info: 'ℹ'
                };
                iconEl.textContent = typeIcons[config.type] || typeIcons.info;
                iconEl.className = 't-message-box-icon';

                btnsEl.innerHTML = '';
                
                if (config.showCancelButton) {
                    const cancelButton = document.createElement('button');
                    cancelButton.className = 't-btn';
                    cancelButton.textContent = config.cancelButtonText;
                    cancelButton.onclick = () => this.closeAction('cancel', config, resolve, reject);
                    btnsEl.appendChild(cancelButton);
                }
                
                if (config.showConfirmButton) {
                    const confirmButton = document.createElement('button');
                    confirmButton.className = 't-btn t-btn-primary';
                    confirmButton.textContent = config.confirmButtonText;
                    confirmButton.onclick = () => this.closeAction('confirm', config, resolve, reject);
                    btnsEl.appendChild(confirmButton);
                }

                if (config.showClose) {
                    const closeBtn = document.getElementById('tMessageBoxClose');
                    closeBtn.style.display = 'flex';
                } else {
                    const closeBtn = document.getElementById('tMessageBoxClose');
                    closeBtn.style.display = 'none';
                }

                overlay.classList.add('active');
                box.className = 't-message-box t-message-box-' + config.type + (config.customClass ? ' ' + config.customClass : '');
                
                if (config.center) {
                    box.classList.add('t-message-box--center');
                }

                if (this.stack.length === 0) {
                    document.body.style.overflow = 'hidden';
                }
                
                this.stack.push({ resolve, reject, config });

                const focusable = btnsEl.querySelector('button');
                if (focusable) focusable.focus();
            });
        },

        /**
         * 执行关闭操作
         */
        closeAction(action, config, resolve, reject) {
            const stackItem = this.stack.pop();
            if (!stackItem) return;

            if (config.beforeClose) {
                config.beforeClose(action, this, () => {
                    this.doClose(config, action, resolve, reject);
                });
            } else {
                this.doClose(config, action, resolve, reject);
            }
        },

        /**
         * 执行实际关闭
         */
        doClose(config, action, resolve, reject) {
            const overlay = document.getElementById('tMessageBoxOverlay');
            overlay.classList.remove('active');

            const inputWrapper = document.querySelector('.t-message-box-input');
            if (inputWrapper) {
                inputWrapper.remove();
            }

            if (this.stack.length === 0) {
                document.body.style.overflow = '';
            }

            if (config.callback) {
                config.callback(action);
            }

            if (action === 'confirm') {
                const inputValue = document.getElementById('tMessageBoxInput')?.value;
                resolve({ action, value: inputValue });
            } else if (action === 'cancel' && config.distbeuishCancelAndClose) {
                reject({ action, value: undefined });
            } else {
                reject({ action, value: undefined });
            }
        },

        /**
         * 关闭消息框
         * @param {string} action - 关闭动作
         */
        close(action = 'close') {
            if (this.stack.length === 0) return;

            const stackItem = this.stack.pop();
            if (!stackItem) return;

            const overlay = document.getElementById('tMessageBoxOverlay');
            overlay.classList.remove('active');

            const inputWrapper = document.querySelector('.t-message-box-input');
            if (inputWrapper) {
                inputWrapper.remove();
            }

            if (this.stack.length === 0) {
                document.body.style.overflow = '';
            }

            const { config, resolve, reject } = stackItem;

            if (config.callback) {
                config.callback(action);
            }

            if (action === 'confirm') {
                const inputValue = document.getElementById('tMessageBoxInput')?.value;
                resolve({ action, value: inputValue });
            } else {
                reject({ action, value: undefined });
            }
        },

        /**
         * Alert 消息提示
         */
        alert(message, title, options) {
            const config = {
                type: 'info',
                title: '提示',
                message: message,
                showConfirmButton: true,
                showCancelButton: false,
                showClose: false
            };
            if (typeof title === 'object') {
                options = title;
                config.title = options.title || '提示';
            } else if (title) {
                config.title = title;
            }
            if (options) {
                Object.assign(config, options);
            }
            return this.show(config);
        },

        /**
         * Confirm 确认消息
         */
        confirm(message, title, options) {
            const config = {
                type: 'warning',
                title: '确认',
                message: message,
                showConfirmButton: true,
                showCancelButton: true,
                showClose: false
            };
            if (typeof title === 'object') {
                options = title;
                config.title = options.title || '确认';
                config.type = options.type || 'warning';
            } else if (title) {
                config.title = title;
            }
            if (options) {
                Object.assign(config, options);
            }
            return this.show(config);
        },

        /**
         * Prompt 输入框
         */
        prompt(message, title, options) {
            const config = {
                type: 'info',
                title: '输入',
                message: message,
                showConfirmButton: true,
                showCancelButton: true,
                showInput: true,
                showClose: false
            };
            if (typeof title === 'object') {
                options = title;
                config.title = options.title || '输入';
            } else if (title) {
                config.title = title;
            }
            if (options) {
                Object.assign(config, options);
            }

            const promise = this.show(config);

            setTimeout(() => {
                const inputContainer = document.querySelector('.t-message-box-content');
                const existingInput = document.querySelector('.t-message-box-input');
                if (inputContainer && config.showInput && !existingInput) {
                    const inputWrapper = document.createElement('div');
                    inputWrapper.className = 't-message-box-input';
                    inputWrapper.innerHTML = `
                        <input type="${config.inputType || 'text'}" id="tMessageBoxInput"
                               class="t-input"
                               placeholder="${config.inputPlaceholder || ''}"
                               pattern="${config.inputPattern || ''}">
                    `;
                    inputContainer.appendChild(inputWrapper);
                }
            }, 0);

            return promise;
        },

        /**
         * 快捷方法 - 成功
         */
        success(message, title) {
            return this.alert(message, title, { type: 'success' });
        },

        /**
         * 快捷方法 - 警告
         */
        warning(message, title) {
            return this.alert(message, title, { type: 'warning' });
        },

        /**
         * 快捷方法 - 错误
         */
        error(message, title) {
            return this.alert(message, title, { type: 'error' });
        },

        /**
         * 快捷方法 - 信息
         */
        info(message, title) {
            return this.alert(message, title, { type: 'info' });
        },

        /**
         * 初始化
         */
        init() {
            const overlay = document.getElementById('tMessageBoxOverlay');
            if (!overlay) {
                const msgBoxHTML = `
                    <div class="t-message-box-overlay" id="tMessageBoxOverlay" onclick="if(event.target===this && TMessageBoxInstance.closeOnClickModal) TMessageBoxInstance.close('close')">
                        <div class="t-message-box" id="tMessageBox">
                            <div class="t-message-box-header">
                                <h4 class="t-message-box-title" id="tMessageBoxTitle">提示</h4>
                                <button class="t-message-box-close" id="tMessageBoxClose" onclick="TMessageBoxInstance.close('close')">×</button>
                            </div>
                            <div class="t-message-box-content">
                                <div class="t-message-box-icon" id="tMessageBoxIcon"></div>
                                <div class="t-message-box-message" id="tMessageBoxMessage"></div>
                            </div>
                            <div class="t-message-box-btns" id="tMessageBoxBtns"></div>
                        </div>
                    </div>
                `;
                document.body.insertAdjacentHTML('beforeend', msgBoxHTML);
            }

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.stack.length > 0) {
                    this.close('close');
                }
            });
        }
    };

    window.TMessageBoxInstance = MessageBox;

    // ==================== Tooltip 文字提示组件 ====================
    
    const Tooltip = {
        /**
         * 显示提示
         * @param {string} tooltipId - 提示ID
         */
        show(tooltipId) {
            const tooltip = document.getElementById(tooltipId);
            if (tooltip) {
                tooltip.classList.add('is-active');
                tooltip.setAttribute('aria-hidden', 'false');
            }
        },

        /**
         * 隐藏提示
         * @param {string} tooltipId - 提示ID
         */
        hide(tooltipId) {
            const tooltip = document.getElementById(tooltipId);
            if (tooltip) {
                tooltip.classList.remove('is-active');
                tooltip.setAttribute('aria-hidden', 'true');
            }
        },

        /**
         * 切换提示
         * @param {string} tooltipId - 提示ID
         */
        toggle(tooltipId) {
            const tooltip = document.getElementById(tooltipId);
            if (tooltip) {
                const isActive = tooltip.classList.toggle('is-active');
                tooltip.setAttribute('aria-hidden', (!isActive).toString());
            }
        }
    };

    // ==================== Steps 步骤条组件 ====================
    
    const Steps = {
        /**
         * 跳转到指定步骤
         * @param {number} stepNumber - 步骤编号
         * @param {string} stepsId - 步骤条ID（可选）
         */
        goTo(stepNumber, stepsId) {
            Message.info('跳转到步骤 ' + stepNumber);
            
            if (stepsId) {
                const steps = document.getElementById(stepsId);
                if (steps) {
                    steps.dispatchEvent(new CustomEvent('t:steps:goto', {
                        detail: { step: stepNumber }
                    }));
                }
            }
        },

        /**
         * 下一步
         * @param {string} stepsId - 步骤条ID
         */
        next(stepsId) {
            const steps = document.getElementById(stepsId);
            if (!steps) return;
            
            const stepElements = steps.querySelectorAll('.t-step');
            let currentIndex = -1;
            
            stepElements.forEach((step, index) => {
                if (step.classList.contains('is-process')) {
                    currentIndex = index;
                }
            });
            
            if (currentIndex === -1) {
                stepElements.forEach((step, index) => {
                    if (step.classList.contains('is-finish')) {
                        currentIndex = index;
                    }
                });
            }
            
            if (currentIndex >= 0 && currentIndex < stepElements.length - 1) {
                stepElements[currentIndex].classList.remove('is-process');
                stepElements[currentIndex].classList.add('is-finish');
                stepElements[currentIndex + 1].classList.remove('is-finish');
                stepElements[currentIndex + 1].classList.add('is-process');
                
                steps.dispatchEvent(new CustomEvent('t:steps:change', {
                    detail: { current: currentIndex + 2, previous: currentIndex + 1 }
                }));
            } else if (currentIndex === -1 && stepElements.length > 0) {
                stepElements[0].classList.add('is-process');
            }
        },

        /**
         * 上一步
         * @param {string} stepsId - 步骤条ID
         */
        prev(stepsId) {
            const steps = document.getElementById(stepsId);
            if (!steps) return;
            
            const stepElements = steps.querySelectorAll('.t-step');
            let currentIndex = -1;
            
            stepElements.forEach((step, index) => {
                if (step.classList.contains('is-process')) {
                    currentIndex = index;
                }
            });
            
            if (currentIndex > 0) {
                stepElements[currentIndex].classList.remove('is-process');
                stepElements[currentIndex - 1].classList.remove('is-finish');
                stepElements[currentIndex - 1].classList.add('is-process');
                
                steps.dispatchEvent(new CustomEvent('t:steps:change', {
                    detail: { current: currentIndex, previous: currentIndex + 1 }
                }));
            }
        }
    };

    // ==================== Message 消息提示组件 ====================
    
    const Message = {
        container: null,
        
        /**
         * 获取或创建消息容器
         * @returns {HTMLElement}
         */
        getContainer() {
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.className = 't-message-container';
                this.container.setAttribute('role', 'region');
                this.container.setAttribute('aria-label', '消息提示');
                document.body.appendChild(this.container);
            }
            return this.container;
        },

        /**
         * 显示消息
         * @param {Object} options - 配置选项
         */
        show(options = {}) {
            const {
                type = 'info',
                message = '',
                duration = 3000,
                showClose = false,
                center = false,
                offset = 20,
                showProgress = false,
                dangerouslyUseHTMLString = false,
                customClass = ''
            } = options;
            
            const container = this.getContainer();
            const el = document.createElement('div');
            
            el.className = `t-message t-message--${type} ${center ? 'is-center' : ''} ${customClass}`;
            el.setAttribute('role', 'alert');
            el.setAttribute('aria-live', 'polite');
            el.style.marginTop = `${offset}px`;
            
            const iconMap = {
                success: '✓',
                warning: '⚠',
                error: '✕',
                info: 'ℹ',
                loading: '⟳'
            };
            
            const messageContent = dangerouslyUseHTMLString ? message : this.escapeHtml(message);
            
            // 加载中图标
            let iconHtml = '';
            if (type === 'loading') {
                iconHtml = `<span class="t-message-loading-icon"></span>`;
            } else {
                iconHtml = `<i class="t-message-icon">${iconMap[type] || iconMap.info}</i>`;
            }
            
            el.innerHTML = `
                ${iconHtml}
                <span class="t-message-content">${messageContent}</span>
                ${showClose ? '<button class="t-message-close" aria-label="关闭">×</button>' : ''}
                ${showProgress && duration > 0 ? '<div class="t-message-progress"></div>' : ''}
            `;
            
            container.appendChild(el);
            
            // 动画进入
            requestAnimationFrame(() => {
                el.classList.add('show');
                
                // 启动进度条动画
                if (showProgress && duration > 0) {
                    const progressBar = el.querySelector('.t-message-progress');
                    if (progressBar) {
                        progressBar.style.width = '100%';
                        progressBar.style.transition = `width ${duration}ms linear`;
                        setTimeout(() => {
                            progressBar.style.width = '0%';
                        }, 10);
                    }
                }
            });
            
            // 关闭按钮事件
            if (showClose) {
                el.querySelector('.t-message-close').addEventListener('click', () => {
                    this.close(el);
                });
            }
            
            // 自动关闭
            if (duration > 0) {
                setTimeout(() => {
                    this.close(el);
                }, duration);
            }
            
            return el;
        },

        /**
         * 关闭消息
         * @param {HTMLElement} el - 消息元素
         */
        close(el) {
            if (!el) return;
            
            el.classList.remove('show');
            el.classList.add('hide');
            
            setTimeout(() => {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            }, 300);
        },

        /**
         * 关闭所有消息
         */
        closeAll() {
            if (this.container) {
                const messages = Array.from(this.container.children);
                messages.forEach(msg => this.close(msg));
            }
        },

        /**
         * HTML 转义
         * @param {string} text - 要转义的文本
         * @returns {string} 转义后的文本
         */
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        // 快捷方法
        success(message, options = {}) {
            return this.show({ ...options, type: 'success', message });
        },
        warning(message, options = {}) {
            return this.show({ ...options, type: 'warning', message });
        },
        error(message, options = {}) {
            return this.show({ ...options, type: 'error', message });
        },
        info(message, options = {}) {
            return this.show({ ...options, type: 'info', message });
        },
        loading(message, options = {}) {
            return this.show({ ...options, type: 'loading', message, duration: 0 });
        }
    };

    // ==================== Alert 警告组件 ====================
    
    const Alert = {
        container: null,
        idCounter: 0,
        overlay: null, // 遮罩层

        /**
         * 获取或创建 Alert 容器
         * @returns {HTMLElement}
         */
        getContainer() {
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.className = 't-alert-container';
                this.container.setAttribute('role', 'region');
                this.container.setAttribute('aria-label', '警告提示');
                document.body.appendChild(this.container);
            }
            return this.container;
        },

        /**
         * 获取或创建遮罩层
         * @returns {HTMLElement}
         */
        getOverlay() {
            if (!this.overlay) {
                this.overlay = document.createElement('div');
                this.overlay.className = 't-alert-overlay';
                document.body.appendChild(this.overlay);
            }
            return this.overlay;
        },

        /**
         * 显示遮罩层
         */
        showOverlay() {
            const overlay = this.getOverlay();
            overlay.style.display = 'block';
            requestAnimationFrame(() => {
                overlay.classList.add('show');
            });
        },

        /**
         * 隐藏遮罩层
         */
        hideOverlay() {
            const overlay = this.getOverlay();
            overlay.classList.remove('show');
            setTimeout(() => {
                if (this.container && this.container.children.length === 0) {
                    overlay.style.display = 'none';
                }
            }, 300);
        },

        /**
         * 显示警告
         * @param {Object} options - 配置选项
         * @returns {string} Alert ID
         */
        show(options = {}) {
            const {
                title = '',
                description = '',
                type = '',
                effect = 'light',
                closable = true,
                closeText = '',
                center = false,
                showIcon = true,
                showClose = true,
                customClass = '',
                duration = 3000, // 默认 3 秒自动关闭
                showProgress = true, // 默认显示进度条
                showConfirm = false,
                collapsible = false,
                defaultExpanded = true,
                overlay = false, // 是否显示遮罩层
                onConfirm,
                onCancel
            } = options;

            const container = this.getContainer();
            const id = `t-alert-${++this.idCounter}`;

            const icons = {
                success: '✓',
                warning: '⚠',
                error: '✕',
                info: 'ℹ'
            };

            const alert = document.createElement('div');
            alert.id = id;
            alert.className = `t-alert ${type ? 't-alert-' + type : ''} ${effect === 'dark' ? 't-alert-dark' : ''} ${center ? 't-alert-center' : ''} ${customClass} ${collapsible ? 't-alert--collapsible' : ''} ${overlay ? 't-alert--with-overlay' : ''}`;
            alert.style.position = 'relative'; // 为进度条定位
            alert.style.zIndex = '9999'; // 确保 alert 在遮罩层之上

            // 显示遮罩层
            if (overlay) {
                this.showOverlay();
            }

            const iconHtml = (type && showIcon) ? `<div class="t-alert-icon">${icons[type] || ''}</div>` : '';

            const closeHtml = (closable && showClose) ?
                `<button class="t-alert-close" onclick="TbeUI.Alert.close('${id}')" ${closeText ? 'style="width: auto; padding: 0 12px; border-radius: 12px;"' : ''}>${closeText || '×'}</button>` : '';

            // 可折叠描述
            let descHtml = '';
            if (description) {
                if (collapsible) {
                    const isExpanded = defaultExpanded ? 'expanded' : 'collapsed';
                    const toggleIcon = defaultExpanded ? '▲' : '▼';
                    descHtml = `
                        <div class="t-alert-description ${isExpanded}" id="${id}-desc">${this.escapeHtml(description)}</div>
                        <div class="t-alert-toggle" onclick="TbeUI.Alert.toggleDescription('${id}')">
                            <span id="${id}-toggle-text">${defaultExpanded ? '收起' : '展开'}</span>
                            <span class="t-alert-toggle-icon ${isExpanded}" id="${id}-toggle-icon">${toggleIcon}</span>
                        </div>
                    `;
                } else {
                    descHtml = `<div class="t-alert-description">${this.escapeHtml(description)}</div>`;
                }
            }

            // 操作按钮
            let actionsHtml = '';
            if (showConfirm) {
                actionsHtml = `
                    <div class="t-alert-actions">
                        <button class="t-alert-action-btn" onclick="TbeUI.Alert.close('${id}'); ${onCancel ? `(${onCancel.toString()})()` : ''}">取消</button>
                        <button class="t-alert-action-btn primary" onclick="TbeUI.Alert.close('${id}'); ${onConfirm ? `(${onConfirm.toString()})()` : ''}">确认</button>
                    </div>
                `;
            }

            // 进度条
            let progressHtml = '';
            if (showProgress && duration > 0) {
                progressHtml = `
                    <div class="t-alert__progress">
                        <div class="t-alert__progress-bar" id="${id}-progress"></div>
                    </div>
                `;
            }

            alert.innerHTML = `
                ${iconHtml}
                <div class="t-alert-content">
                    <div class="t-alert-title">${this.escapeHtml(title)}</div>
                    ${descHtml}
                    ${actionsHtml}
                </div>
                ${closeHtml}
                ${progressHtml}
            `;

            container.appendChild(alert);

            // 触发动画
            requestAnimationFrame(() => {
                alert.classList.add('show');
                
                // 启动进度条动画
                if (showProgress && duration > 0) {
                    const progressBar = document.getElementById(`${id}-progress`);
                    if (progressBar) {
                        progressBar.style.transition = `transform ${duration}ms linear`;
                        progressBar.style.transform = 'scaleX(0)';
                    }
                }
            });

            // 自动关闭
            if (duration > 0) {
                setTimeout(() => {
                    this.close(id);
                }, duration);
            }

            return id;
        },

        /**
         * 关闭指定 Alert
         * @param {string} id - Alert ID
         */
        close(id) {
            const alert = document.getElementById(id);
            if (!alert) return;

            alert.classList.remove('show');

            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
                
                // 如果没有 alert 了，隐藏遮罩层
                if (this.container && this.container.children.length === 0) {
                    this.hideOverlay();
                }
            }, 300);
        },

        /**
         * 切换 Alert 描述展开/收起
         * @param {string} alertId - Alert ID
         */
        toggleDescription(alertId) {
            const desc = document.getElementById(`${alertId}-desc`);
            const toggleText = document.getElementById(`${alertId}-toggle-text`);
            const toggleIcon = document.getElementById(`${alertId}-toggle-icon`);
            
            if (desc && toggleText && toggleIcon) {
                if (desc.classList.contains('collapsed')) {
                    desc.classList.remove('collapsed');
                    desc.classList.add('expanded');
                    toggleText.textContent = '收起';
                    toggleIcon.textContent = '▲';
                    toggleIcon.classList.add('expanded');
                } else {
                    desc.classList.remove('expanded');
                    desc.classList.add('collapsed');
                    toggleText.textContent = '展开';
                    toggleIcon.textContent = '▼';
                    toggleIcon.classList.remove('expanded');
                }
            }
        },

        /**
         * 关闭所有 Alert
         */
        closeAll() {
            document.querySelectorAll('.t-alert').forEach(alert => {
                this.close(alert.id);
            });
        },

        /**
         * HTML 转义
         * @param {string} text - 要转义的文本
         * @returns {string} 转义后的文本
         */
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        // 快捷方法
        success(title, options = {}) {
            return this.show({ ...options, type: 'success', title });
        },
        warning(title, options = {}) {
            return this.show({ ...options, type: 'warning', title });
        },
        error(title, options = {}) {
            return this.show({ ...options, type: 'error', title });
        },
        info(title, options = {}) {
            return this.show({ ...options, type: 'info', title });
        }
    };

    // ==================== Notification 通知组件 ====================
    
    const Notification = {
        container: null,
        idCounter: 0,

        /**
         * 获取或创建通知容器
         * @param {string} position - 位置
         * @returns {HTMLElement}
         */
        getContainer(position = 'top-right') {
            const containerId = `t-notification-container-${position}`;
            let container = document.getElementById(containerId);

            if (!container) {
                container = document.createElement('div');
                container.id = containerId;
                container.className = `t-notification-container t-notification-container-${position}`;
                container.setAttribute('role', 'region');
                container.setAttribute('aria-label', '通知');
                document.body.appendChild(container);
            }

            return container;
        },

        /**
         * 显示通知
         * @param {Object} options - 配置选项
         */
        show(options = {}) {
            const {
                type = 'info',
                title = '',
                message = '',
                duration = 4500,
                showClose = true,
                position = 'top-right',
                offset = 0,
                showProgress = false,
                dangerouslyUseHTMLString = false,
                customClass = '',
                icon = ''
            } = options;
            
            const container = this.getContainer(position);
            const id = `t-notification-${++this.idCounter}`;
            const el = document.createElement('div');
            
            el.id = id;
            el.className = `t-notification t-notification--${type} ${customClass}`;
            el.setAttribute('role', 'alert');
            el.style.marginTop = `${offset}px`;
            
            const iconMap = {
                success: '✓',
                warning: '⚠',
                error: '✕',
                info: 'ℹ'
            };
            
            // 处理 HTML 内容
            const messageContent = dangerouslyUseHTMLString ? message : this.escapeHtml(message);
            const titleContent = dangerouslyUseHTMLString ? title : this.escapeHtml(title);
            
            // 构建图标 HTML
            let iconHtml = '';
            if (icon) {
                // 自定义图标（Emoji 等）
                iconHtml = `<div class="t-notification-icon">${icon}</div>`;
            } else {
                iconHtml = `<div class="t-notification-icon">${iconMap[type] || iconMap.info}</div>`;
            }

            // 构建操作按钮 HTML
            let actionsHtml = '';
            if (options.actions && options.actions.length > 0) {
                actionsHtml = `<div class="t-notification-actions">`;
                options.actions.forEach((action, index) => {
                    const actionType = action.type || '';
                    actionsHtml += `<button class="t-notification-action-btn ${actionType}" data-action-index="${index}">${action.text}</button>`;
                });
                actionsHtml += `</div>`;
            }

            el.innerHTML = `
                ${iconHtml}
                <div class="t-notification-content">
                    <div class="t-notification-title">${titleContent}</div>
                    <div class="t-notification-message">${messageContent}</div>
                    ${actionsHtml}
                </div>
                ${showClose ? `<button class="t-notification-close" aria-label="关闭通知">×</button>` : ''}
                ${showProgress && duration > 0 ? `<div class="t-notification-progress"></div>` : ''}
            `;

            // 绑定关闭按钮事件
            if (showClose) {
                const closeBtn = el.querySelector('.t-notification-close');
                closeBtn.addEventListener('click', () => {
                    this.close(id);
                });
            }

            // 绑定操作按钮事件
            if (options.actions && options.actions.length > 0) {
                const actionBtns = el.querySelectorAll('.t-notification-action-btn');
                actionBtns.forEach((btn, index) => {
                    btn.addEventListener('click', () => {
                        const action = options.actions[index];
                        if (action && typeof action.callback === 'function') {
                            action.callback();
                        }
                        // 点击操作按钮后关闭通知
                        this.close(id);
                    });
                });
            }
            
            container.appendChild(el);
            
            // 动画进入
            requestAnimationFrame(() => {
                el.classList.add('show');

                // 启动进度条动画
                if (showProgress && duration > 0) {
                    const progressBar = el.querySelector('.t-notification-progress');
                    if (progressBar) {
                        progressBar.style.width = '100%';
                        progressBar.style.transition = `width ${duration}ms linear`;
                        setTimeout(() => {
                            progressBar.style.width = '0%';
                        }, 10);
                    }
                }
            });
            
            // 自动关闭
            if (duration > 0) {
                setTimeout(() => {
                    this.close(id);
                }, duration);
            }
            
            return id;
        },

        /**
         * HTML 转义
         * @param {string} text - 要转义的文本
         * @returns {string} 转义后的文本
         */
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        /**
         * 关闭通知
         * @param {string} id - 通知 ID
         */
        close(id) {
            const el = document.getElementById(id);
            if (!el) return;
            
            el.classList.remove('show');
            el.classList.add('hide');
            
            setTimeout(() => {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            }, 300);
        },

        /**
         * 关闭所有通知
         */
        closeAll() {
            const containers = document.querySelectorAll('.t-notification-container');
            containers.forEach(container => {
                while (container.firstChild) {
                    if (container.firstChild.id) {
                        this.close(container.firstChild.id);
                    } else {
                        container.removeChild(container.firstChild);
                    }
                }
            });
        },
        /**
         * 带操作按钮的通知示例
         */
        showNotificationWithAction() {
            this.show({
                type: 'warning',
                title: '确认删除',
                message: '确定要删除这条记录吗？此操作不可恢复。',
                duration: 0,
                showProgress: false,
                actions: [
                    { text: '取消', callback: () => {} },
                    { text: '确认删除', primary: true, callback: () => {
                        this.show({ type: 'success', title: '已删除', message: '记录已成功删除', duration: 3000 });
                    }}
                ]
            });
        },

        /**
         * 显示分组通知
         */
        showGroupedNotifications() {
            const messages = [
                { type: 'success', title: '消息 1', message: '这是第一条分组消息' },
                { type: 'info', title: '消息 2', message: '这是第二条分组消息' },
                { type: 'warning', title: '消息 3', message: '这是第三条分组消息' }
            ];

            messages.forEach((msg, index) => {
                setTimeout(() => {
                    this.show({ ...msg, duration: 5000 });
                }, index * 300);
            });
        }
    };

    // ==================== NavMenu 导航菜单组件 ====================
    
    const NavMenu = {
        activeMenu: null,
        
        /**
         * 初始化导航菜单
         * @param {string} selector - 导航菜单选择器
         * @param {Object} options - 配置选项
         */
        init(selector = '.t-nav-menu', options = {}) {
            const menus = document.querySelectorAll(selector);
            
            menus.forEach(menu => {
                // 处理子菜单展开/收起
                menu.querySelectorAll('.t-nav-submenu > .t-nav-menu-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        if (options.accordion !== false) {
                            // 手风琴模式：关闭其他子菜单
                            const siblings = item.parentElement.parentElement.querySelectorAll('.t-nav-submenu.is-opened');
                            siblings.forEach(submenu => {
                                if (submenu !== item.parentElement) {
                                    submenu.classList.remove('is-opened');
                                }
                            });
                        }
                        
                        item.parentElement.classList.toggle('is-opened');
                        
                        // 触发自定义事件
                        menu.dispatchEvent(new CustomEvent('t:navmenu:toggle', {
                            detail: { item, isOpen: item.parentElement.classList.contains('is-opened') }
                        }));
                    });
                });
                
                // 处理菜单项点击
                menu.querySelectorAll('.t-nav-menu-item:not(.t-nav-submenu > .t-nav-menu-item)').forEach(item => {
                    item.addEventListener('click', (e) => {
                        // 移除其他激活状态
                        menu.querySelectorAll('.t-nav-menu-item.active').forEach(activeItem => {
                            if (activeItem !== item) {
                                activeItem.classList.remove('active');
                            }
                        });
                        
                        // 添加激活状态
                        item.classList.add('active');
                        
                        // 触发自定义事件
                        menu.dispatchEvent(new CustomEvent('t:navmenu:select', {
                            detail: { item, index: Array.from(menu.querySelectorAll('.t-nav-menu-item')).indexOf(item) }
                        }));
                    });
                });
            });
            
            return this;
        },
        
        /**
         * 打开子菜单
         * @param {HTMLElement} submenu - 子菜单元素
         */
        openSubmenu(submenu) {
            if (submenu && submenu.classList.contains('t-nav-submenu')) {
                submenu.classList.add('is-opened');
            }
        },
        
        /**
         * 关闭子菜单
         * @param {HTMLElement} submenu - 子菜单元素
         */
        closeSubmenu(submenu) {
            if (submenu && submenu.classList.contains('t-nav-submenu')) {
                submenu.classList.remove('is-opened');
            }
        },
        
        /**
         * 折叠菜单（仅显示图标）
         * @param {string} selector - 导航菜单选择器
         */
        collapse(selector = '.t-nav-menu') {
            const menu = document.querySelector(selector);
            if (menu) {
                menu.classList.add('t-nav-menu--collapsed');
            }
        },
        
        /**
         * 展开菜单
         * @param {string} selector - 导航菜单选择器
         */
        expand(selector = '.t-nav-menu') {
            const menu = document.querySelector(selector);
            if (menu) {
                menu.classList.remove('t-nav-menu--collapsed');
            }
        },
        
        /**
         * 移动端：打开侧边栏
         * @param {string} sidebarSelector - 侧边栏选择器
         * @param {string} overlaySelector - 遮罩层选择器
         */
        openMobileSidebar(sidebarSelector = '.sidebar', overlaySelector = '.sidebar-overlay') {
            const sidebar = document.querySelector(sidebarSelector);
            const overlay = document.querySelector(overlaySelector);
            
            if (sidebar) {
                sidebar.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            if (overlay) {
                overlay.classList.add('active');
            }
        },
        
        /**
         * 移动端：关闭侧边栏
         * @param {string} sidebarSelector - 侧边栏选择器
         * @param {string} overlaySelector - 遮罩层选择器
         */
        closeMobileSidebar(sidebarSelector = '.sidebar', overlaySelector = '.sidebar-overlay') {
            const sidebar = document.querySelector(sidebarSelector);
            const overlay = document.querySelector(overlaySelector);
            
            if (sidebar) {
                sidebar.classList.remove('active');
            }
            if (overlay) {
                overlay.classList.remove('active');
            }
            document.body.style.overflow = '';
        },
        
        /**
         * 移动端：切换侧边栏
         * @param {string} sidebarSelector - 侧边栏选择器
         * @param {string} overlaySelector - 遮罩层选择器
         */
        toggleMobileSidebar(sidebarSelector = '.sidebar', overlaySelector = '.sidebar-overlay') {
            const sidebar = document.querySelector(sidebarSelector);
            if (sidebar && sidebar.classList.contains('active')) {
                this.closeMobileSidebar(sidebarSelector, overlaySelector);
            } else {
                this.openMobileSidebar(sidebarSelector, overlaySelector);
            }
        }
    };
    
    // ==================== Backtop 回到顶部组件 ====================
    
    const Backtop = {
        instances: new Map(),
        
        /**
         * 初始化回到顶部组件
         * @param {string} selector - 按钮选择器
         * @param {Object} options - 配置选项
         */
        init(selector = '.t-backtop', options = {}) {
            const buttons = document.querySelectorAll(selector);
            
            buttons.forEach(button => {
                const config = {
                    visibilityOffset: 200,
                    scrollDuration: 300,
                    target: null,
                    ...options
                };
                
                // 获取滚动目标
                let scrollTarget;
                const targetId = button.getAttribute('data-target');
                
                if (targetId) {
                    scrollTarget = document.getElementById(targetId);
                } else if (config.target) {
                    scrollTarget = typeof config.target === 'string' 
                        ? document.querySelector(config.target) 
                        : config.target;
                }
                
                // 如果没有指定目标，则滚动到页面顶部
                if (!scrollTarget) {
                    scrollTarget = window;
                }
                
                this.instances.set(button, { scrollTarget, config });
                
                // 绑定点击事件
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.scrollToTop(button);
                });
                
                // 绑定滚动事件
                const scrollHandler = throttle(() => {
                    this.updateVisibility(button);
                }, 100);
                
                if (scrollTarget === window) {
                    window.addEventListener('scroll', scrollHandler);
                } else {
                    scrollTarget.addEventListener('scroll', scrollHandler);
                }
                
                // 初始状态检查
                this.updateVisibility(button);
            });
            
            return this;
        },
        
        /**
         * 更新按钮可见性
         * @param {HTMLElement} button - 按钮元素
         */
        updateVisibility(button) {
            const instance = this.instances.get(button);
            if (!instance) return;
            
            const { scrollTarget, config } = instance;
            let scrollTop;
            
            if (scrollTarget === window) {
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            } else {
                scrollTop = scrollTarget.scrollTop;
            }
            
            if (scrollTop > config.visibilityOffset) {
                button.classList.add('is-visible');
            } else {
                button.classList.remove('is-visible');
            }
        },
        
        /**
         * 滚动到顶部
         * @param {HTMLElement} button - 按钮元素
         */
        scrollToTop(button) {
            const instance = this.instances.get(button);
            if (!instance) return;
            
            const { scrollTarget, config } = instance;
            
            if (scrollTarget === window) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                scrollTarget.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
            
            // 触发自定义事件
            button.dispatchEvent(new CustomEvent('t:backtop:click'));
        },
        
        /**
         * 销毁实例
         * @param {string} selector - 按钮选择器
         */
        destroy(selector = '.t-backtop') {
            document.querySelectorAll(selector).forEach(button => {
                this.instances.delete(button);
            });
        }
    };
    
    // ==================== Switch 开关组件 ====================

    const Switch = {
        /**
         * 切换开关状态（兼容旧版调用方式）
         * @param {string} switchId - 开关ID
         */
        toggleSwitch(switchId) {
            this.toggle(switchId);
        },

        /**
         * 切换开关状态
         * @param {string} switchId - 开关ID
         */
        toggle(switchId) {
            const switchEl = document.getElementById(switchId);
            if (!switchEl || switchEl.classList.contains('is-disabled')) return;

            const input = switchEl.querySelector('.t-switch__input');
            if (input) {
                input.checked = !input.checked;
                switchEl.classList.toggle('is-checked', input.checked);
                switchEl.setAttribute('aria-checked', input.checked.toString());

                // 触发自定义事件
                switchEl.dispatchEvent(new CustomEvent('t:switch:change', {
                    detail: { checked: input.checked }
                }));

                // 自动更新对应的值显示元素（如 switch7-value）
                const valueDisplay = document.getElementById(switchId + '-value');
                if (valueDisplay) {
                    valueDisplay.textContent = '当前值: ' + input.checked;
                }
            }
        },

        /**
         * 初始化所有 Switch 组件
         */
        init() {
            document.querySelectorAll('.t-switch').forEach(switchEl => {
                const input = switchEl.querySelector('.t-switch__input');
                if (input) {
                    input.addEventListener('change', () => {
                        switchEl.classList.toggle('is-checked', input.checked);
                        switchEl.setAttribute('aria-checked', input.checked.toString());
                    });
                }
            });
        }
    };

    // ==================== Slider 滑块组件 ====================

    const Slider = {
        /**
         * 点击滑块轨道（兼容旧版调用方式）
         * @param {Event} event - 点击事件
         * @param {string} sliderId - 滑块ID
         */
        clickSlider(event, sliderId) {
            this.click(event, sliderId);
        },

        /**
         * 开始拖拽滑块按钮（兼容旧版调用方式）
         * @param {Event} event - 鼠标事件
         * @param {string} sliderId - 滑块ID
         * @param {number} buttonIdx - 按钮索引
         */
        startDragSlider(event, sliderId, buttonIdx = 0) {
            // 如果 buttonIdx 是字符串，转换为数字
            if (typeof buttonIdx === 'string') {
                buttonIdx = parseInt(buttonIdx, 10) || 0;
            }
            // 获取按钮元素
            const slider = document.getElementById(sliderId);
            if (!slider) return;
            const buttons = slider.querySelectorAll('.t-slider__button-wrapper');
            const button = buttons[buttonIdx];
            if (button) {
                // 创建一个包含 currentTarget 的事件对象
                const fakeEvent = {
                    preventDefault: () => event.preventDefault(),
                    stopPropagation: () => event.stopPropagation(),
                    currentTarget: button,
                    clientX: event.clientX,
                    clientY: event.clientY
                };
                this.startDrag(fakeEvent, sliderId);
            }
        },

        /**
         * 更新滑块值
         * @param {string} sliderId - 滑块ID
         * @param {number} percent - 百分比 (0-100)
         * @param {number} buttonIdx - 按钮索引
         */
        updateValue(sliderId, percent, buttonIdx = 0) {
            const slider = document.getElementById(sliderId);
            if (!slider) return;
            
            const runway = slider.querySelector('.t-slider__runway');
            const bar = slider.querySelector('.t-slider__bar');
            const buttons = slider.querySelectorAll('.t-slider__button-wrapper');
            
            if (runway && bar && buttons[buttonIdx]) {
                const button = buttons[buttonIdx];
                button.style.left = percent + '%';
                
                // 更新 tooltip
                const tooltip = button.querySelector('.t-slider__tooltip');
                if (tooltip) {
                    tooltip.textContent = Math.round(percent) + '%';
                }
                
                // 更新数值显示（如果存在）
                const valueDisplay = slider.querySelector('.t-slider__value');
                if (valueDisplay) {
                    valueDisplay.textContent = Math.round(percent);
                }
                
                // 处理范围选择
                if (slider.classList.contains('is-range') && buttons.length >= 2) {
                    const button0 = buttons[0];
                    const button1 = buttons[1];
                    const leftPercent = Math.min(parseFloat(button0.style.left), parseFloat(button1.style.left));
                    const rightPercent = Math.max(parseFloat(button0.style.left), parseFloat(button1.style.left));
                    bar.style.left = leftPercent + '%';
                    bar.style.width = (rightPercent - leftPercent) + '%';
                } else {
                    bar.style.left = '0%';
                    bar.style.width = percent + '%';
                }
                
                // 触发自定义事件
                slider.dispatchEvent(new CustomEvent('t:slider:change', {
                    detail: { value: percent, buttonIndex: buttonIdx }
                }));
            }
        },

        /**
         * 点击滑块轨道更新值
         * @param {Event} event - 点击事件
         * @param {string} sliderId - 滑块ID
         */
        click(event, sliderId) {
            const slider = document.getElementById(sliderId);
            if (!slider) return;
            
            const runway = slider.querySelector('.t-slider__runway');
            if (!runway) return;
            
            const rect = runway.getBoundingClientRect();
            let percent = ((event.clientX - rect.left) / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent));
            
            // 处理范围选择：选择离点击位置最近的按钮
            if (slider.classList.contains('is-range')) {
                const buttons = slider.querySelectorAll('.t-slider__button-wrapper');
                if (buttons.length >= 2) {
                    const button0Left = parseFloat(buttons[0].style.left);
                    const button1Left = parseFloat(buttons[1].style.left);
                    const distance0 = Math.abs(percent - button0Left);
                    const distance1 = Math.abs(percent - button1Left);
                    const targetButtonIdx = distance0 < distance1 ? 0 : 1;
                    this.updateValue(sliderId, percent, targetButtonIdx);
                }
            } else {
                this.updateValue(sliderId, percent, 0);
            }
        },
        
        /**
         * 开始拖拽滑块按钮
         * @param {Event} event - 鼠标事件
         * @param {string} sliderId - 滑块ID
         */
        startDrag(event, sliderId) {
            event.preventDefault();
            event.stopPropagation();
            
            const slider = document.getElementById(sliderId);
            if (!slider) return;
            
            const runway = slider.querySelector('.t-slider__runway');
            const button = event.currentTarget;
            const buttons = slider.querySelectorAll('.t-slider__button-wrapper');
            const buttonIdx = Array.from(buttons).indexOf(button);
            
            if (!runway || !button) return;
            
            button.classList.add('is-dragging');
            
            const handleMouseMove = (e) => {
                const rect = runway.getBoundingClientRect();
                let percent = ((e.clientX - rect.left) / rect.width) * 100;
                percent = Math.max(0, Math.min(100, percent));
                
                // 范围选择的边界检查
                if (slider.classList.contains('is-range') && buttons.length >= 2) {
                    const otherButtonIdx = buttonIdx === 0 ? 1 : 0;
                    const otherButton = buttons[otherButtonIdx];
                    const otherPercent = parseFloat(otherButton.style.left);
                    
                    if (buttonIdx === 0) {
                        // 第一个按钮不能超过第二个按钮
                        percent = Math.min(percent, otherPercent - 1);
                    } else {
                        // 第二个按钮不能小于第一个按钮
                        percent = Math.max(percent, otherPercent + 1);
                    }
                }
                
                this.updateValue(sliderId, percent, buttonIdx);
            };
            
            const handleMouseUp = () => {
                button.classList.remove('is-dragging');
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        },

        /**
         * 初始化所有 Slider 组件
         */
        init() {
            document.querySelectorAll('.t-slider').forEach(slider => {
                let isDragging = false;
                let currentButton = null;
                
                const buttons = slider.querySelectorAll('.t-slider__button-wrapper');
                const runway = slider.querySelector('.t-slider__runway');
                
                buttons.forEach((button, idx) => {
                    button.addEventListener('mousedown', (e) => {
                        isDragging = true;
                        currentButton = button;
                        button.classList.add('is-dragging');
                        e.preventDefault();
                    });
                });
                
                document.addEventListener('mousemove', (e) => {
                    if (!isDragging || !currentButton || !runway) return;
                    
                    const rect = runway.getBoundingClientRect();
                    let percent = ((e.clientX - rect.left) / rect.width) * 100;
                    percent = Math.max(0, Math.min(100, percent));
                    
                    const buttonIdx = Array.from(buttons).indexOf(currentButton);
                    this.updateValue(slider.id, percent, buttonIdx);
                });
                
                document.addEventListener('mouseup', () => {
                    if (currentButton) {
                        currentButton.classList.remove('is-dragging');
                    }
                    isDragging = false;
                    currentButton = null;
                });
            });
        }
    };

    // ==================== Rate 评分组件 ====================

    const Rate = {
        /**
         * 存储评分组件状态
         */
        states: {},

        /**
         * 设置评分值（兼容旧版调用方式）
         * @param {string} rateId - 评分组件ID
         * @param {number} value - 评分值 (1-5)
         */
        setRate(rateId, value) {
            this.set(rateId, value);
        },

        /**
         * 鼠标悬停效果（兼容旧版调用方式）
         * @param {string} rateId - 评分组件ID
         * @param {number} value - 悬停的评分值
         */
        hoverRate(rateId, value) {
            this.hover(rateId, value);
        },

        /**
         * 鼠标离开效果（兼容旧版调用方式）
         * @param {string} rateId - 评分组件ID
         */
        leaveRate(rateId) {
            this.leave(rateId);
        },

        /**
         * 设置评分值
         * @param {string} rateId - 评分组件ID
         * @param {number} value - 评分值 (1-5)
         */
        set(rateId, value) {
            const rate = document.getElementById(rateId);
            if (!rate) return;

            // 初始化状态
            if (!this.states[rateId]) {
                this.states[rateId] = { value: 0 };
            }

            this.states[rateId].value = value;

            // 更新星星显示（支持 t-rate-star 和 t-rate__star 两种类名）
            const stars = rate.querySelectorAll('.t-rate-star, .t-rate__star');
            stars.forEach((star, index) => {
                if (index < value) {
                    star.classList.add('active', 'is-active');
                } else {
                    star.classList.remove('active', 'is-active');
                }
            });

            // 更新辅助文字
            const textEl = document.getElementById(rateId + '-text');
            if (textEl) {
                const texts = ['很差', '较差', '一般', '满意', '非常满意'];
                textEl.textContent = texts[value - 1] || '';
            }

            // 更新分数显示
            const scoreEl = document.getElementById(rateId + '-score');
            if (scoreEl) {
                scoreEl.textContent = value + ' 分';
            }

            // 触发事件
            rate.dispatchEvent(new CustomEvent('t:rate:change', {
                detail: { value }
            }));
        },

        /**
         * 鼠标悬停效果
         * @param {string} rateId - 评分组件ID
         * @param {number} value - 悬停的评分值
         */
        hover(rateId, value) {
            const rate = document.getElementById(rateId);
            if (!rate) return;

            // 支持 t-rate-star 和 t-rate__star 两种类名
            const stars = rate.querySelectorAll('.t-rate-star, .t-rate__star');
            stars.forEach((star, index) => {
                if (index < value) {
                    star.classList.add('hover', 'is-hover');
                } else {
                    star.classList.remove('hover', 'is-hover');
                }
            });

            // 更新辅助文字
            const textEl = document.getElementById(rateId + '-text');
            if (textEl) {
                const texts = ['很差', '较差', '一般', '满意', '非常满意'];
                textEl.textContent = texts[value - 1] || '';
            }
        },

        /**
         * 鼠标离开效果
         * @param {string} rateId - 评分组件ID
         */
        leave(rateId) {
            const rate = document.getElementById(rateId);
            if (!rate) return;

            // 支持 t-rate-star 和 t-rate__star 两种类名
            const stars = rate.querySelectorAll('.t-rate-star, .t-rate__star');
            stars.forEach(star => {
                star.classList.remove('hover', 'is-hover');
            });

            // 恢复到当前评分值
            const state = this.states[rateId];
            if (state) {
                this.set(rateId, state.value);
            }
        }
    };

    // ==================== Loading 加载组件 ====================
    
    const Loading = {
        /**
         * 显示加载
         * @param {HTMLElement} target - 目标元素
         * @param {Object} options - 配置选项
         */
        show(target, options = {}) {
            if (!target) return;
            
            const text = options.text || '加载中...';
            const fullscreen = options.fullscreen || false;
            
            const loadingEl = document.createElement('div');
            loadingEl.className = 't-loading-mask';
            loadingEl.innerHTML = `
                <div class="t-loading-spinner">
                    <div class="t-loading-spinner__circle"></div>
                    ${text ? `<p class="t-loading-text">${text}</p>` : ''}
                </div>
            `;
            
            if (fullscreen) {
                loadingEl.classList.add('is-fullscreen');
                document.body.appendChild(loadingEl);
            } else {
                target.style.position = 'relative';
                target.appendChild(loadingEl);
            }
            
            return loadingEl;
        },

        /**
         * 关闭加载
         * @param {HTMLElement} loadingEl - 加载元素
         */
        close(loadingEl) {
            if (loadingEl && loadingEl.parentNode) {
                loadingEl.parentNode.removeChild(loadingEl);
            }
        },

        /**
         * 全屏加载
         * @param {Object} options - 配置选项
         * @returns {Object} 关闭方法
         */
        fullscreen(options = {}) {
            const loadingEl = this.show(null, { ...options, fullscreen: true });
            return {
                close: () => this.close(loadingEl)
            };
        },

        /**
         * Loading 服务方式
         * @param {Object} options - 配置选项
         * @returns {Object} 实例，包含 close 方法
         */
        service(options = {}) {
            const {
                text = '加载中...',
                fullscreen = true,
                lock = false,
                spinner: spinnerType = 'spinner',
                background = '',
                customClass = ''
            } = options;

            const loadingEl = document.createElement('div');
            loadingEl.className = 't-loading-mask' + (fullscreen ? ' fullscreen' : '');
            if (customClass) {
                loadingEl.classList.add(customClass);
            }
            if (background) {
                loadingEl.style.background = background;
            }

            let spinnerHtml = '';
            switch (spinnerType) {
                case 'wave':
                    spinnerHtml = '<div class="t-loading-wave"><span></span><span></span><span></span><span></span><span></span></div>';
                    break;
                case 'dots':
                    spinnerHtml = '<div class="t-loading-dots"><span></span><span></span><span></span></div>';
                    break;
                case 'ring':
                    spinnerHtml = '<div class="t-loading-ring"></div>';
                    break;
                case 'square':
                    spinnerHtml = '<div class="t-loading-square"></div>';
                    break;
                case 'gradient':
                    spinnerHtml = '<div class="t-loading-gradient"></div>';
                    break;
                default:
                    spinnerHtml = '<div class="t-loading-spinner"><div class="t-loading-spinner__circle"></div></div>';
            }

            loadingEl.innerHTML = `
                ${spinnerHtml}
                ${text ? `<p class="t-loading-text">${text}</p>` : ''}
            `;

            if (fullscreen) {
                document.body.appendChild(loadingEl);
                loadingEl.classList.add('active');
                if (lock) {
                    document.body.style.overflow = 'hidden';
                }
            }

            return {
                close: () => {
                    if (loadingEl.parentNode) {
                        loadingEl.parentNode.removeChild(loadingEl);
                    }
                    if (lock && fullscreen) {
                        document.body.style.overflow = '';
                    }
                }
            };
        },

        /**
         * 初始化 Loading 组件
         */
        init() {
            // Loading 组件主要通过全局函数调用，无需特殊初始化
        }
    };

    // ==================== Collapse 折叠面板组件 ====================
    
    const Collapse = {
        /**
         * 切换折叠面板
         * @param {HTMLElement} header - 面板头部元素
         */
        toggle(header) {
            const item = header.closest('.t-collapse-item');
            if (!item) return;
            
            // 检查是否为禁用状态
            if (item.classList.contains('t-collapse-item--disabled')) {
                return;
            }
            
            // 获取父级手风琴容器
            const collapse = item.parentElement;
            
            // 检查是否只允许展开一项（默认行为）
            const isAccordion = !collapse.classList.contains('t-collapse--multiple');
            
            // 当前项是否已展开
            const isActive = item.classList.contains('active');
            
            // 如果是手风琴模式且当前项未展开，则关闭其他所有展开的项
            if (isAccordion && !isActive) {
                const activeItems = collapse.querySelectorAll('.t-collapse-item.active');
                activeItems.forEach(activeItem => {
                    activeItem.classList.remove('active');
                    const activeContent = activeItem.querySelector('.t-collapse-content, .t-collapse-item__content');
                    if (activeContent) {
                        activeContent.style.maxHeight = '0';
                    }
                    const activeArrow = activeItem.querySelector('.t-collapse-arrow');
                    if (activeArrow) {
                        activeArrow.style.transform = 'rotate(0deg)';
                    }
                });
            }
            
            // 切换当前项的状态
            item.classList.toggle('active');
            
            // 获取内容区域（兼容新旧类名）
            const content = item.querySelector('.t-collapse-content') || 
                           item.querySelector('.t-collapse-item__content') ||
                           item.querySelector('.t-collapse-body');
            
            // 获取箭头图标
            const arrow = item.querySelector('.t-collapse-arrow');
            
            if (content) {
                const isNowActive = item.classList.contains('active');
                if (isNowActive) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = '0';
                }
            }
            
            // 旋转箭头
            if (arrow) {
                const isNowActive = item.classList.contains('active');
                arrow.style.transform = isNowActive ? 'rotate(90deg)' : 'rotate(0deg)';
            }
            
            // 更新 aria 属性
            header.setAttribute('aria-expanded', item.classList.contains('active').toString());
            
            // 触发自定义事件
            item.dispatchEvent(new CustomEvent('t:collapse:change', {
                detail: { isActive: item.classList.contains('active') }
            }));
        },

        /**
         * 初始化所有 Collapse 组件
         */
        init() {
            // 支持两种调用方式：通过 onclick 属性和通过事件监听
            document.querySelectorAll('.t-collapse').forEach(collapse => {
                // 为所有头部元素添加点击事件
                const headers = collapse.querySelectorAll('.t-collapse-header, .t-collapse-item__header');
                headers.forEach(header => {
                    // 如果已经有 onclick 属性，则不重复添加
                    if (!header.getAttribute('onclick')) {
                        header.addEventListener('click', function(e) {
                            // 如果点击的是禁用状态，则不处理
                            const item = header.closest('.t-collapse-item');
                            if (item && item.classList.contains('t-collapse-item--disabled')) {
                                e.preventDefault();
                                return;
                            }
                            Collapse.toggle(header);
                        });
                    }
                });
            });
        }
    };

    // ==================== Countdown 倒计时组件 ====================
    
    const Countdown = {
        timers: {},

        /**
         * 开始倒计时
         * @param {string} id - 倒计时元素ID
         * @param {Date} endTime - 结束时间
         * @param {string} format - 格式 (dd天HH小时mm分ss秒)
         */
        start(id, endTime, format = 'HH:mm:ss') {
            const el = document.getElementById(id);
            if (!el) return;
            
            // 清除已有定时器
            if (this.timers[id]) {
                clearInterval(this.timers[id]);
            }
            
            const update = () => {
                const now = new Date().getTime();
                const end = new Date(endTime).getTime();
                const diff = end - now;
                
                if (diff <= 0) {
                    el.textContent = '已结束';
                    clearInterval(this.timers[id]);
                    delete this.timers[id];
                    el.dispatchEvent(new CustomEvent('t:countdown:end'));
                    return;
                }
                
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                
                let result = format;
                result = result.replace('dd', String(days).padStart(2, '0'));
                result = result.replace('HH', String(hours).padStart(2, '0'));
                result = result.replace('mm', String(minutes).padStart(2, '0'));
                result = result.replace('ss', String(seconds).padStart(2, '0'));
                
                el.textContent = result;
            };
            
            update();
            this.timers[id] = setInterval(update, 1000);
        },

        /**
         * 停止倒计时
         * @param {string} id - 倒计时元素ID
         */
        stop(id) {
            if (this.timers[id]) {
                clearInterval(this.timers[id]);
                delete this.timers[id];
            }
        }
    };

    // ==================== ColorPicker 颜色选择器组件 ====================

    const ColorPicker = {
        /**
         * 存储颜色选择器状态
         */
        states: {},

        /**
         * 切换颜色选择器显示/隐藏（兼容旧版调用方式）
         * @param {string} pickerId - 选择器ID
         * @param {Event} event - 事件对象
         */
        toggleColorPicker(pickerId, event) {
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            this.toggle(pickerId);
        },

        /**
         * 选择预设颜色（兼容旧版调用方式）
         * @param {string} pickerId - 选择器ID
         * @param {string} color - 颜色值
         * @param {Event} event - 事件对象
         */
        selectPredefineColor(pickerId, color, event) {
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            this.setColor(pickerId, color);
        },

        /**
         * 确认颜色选择（兼容旧版调用方式）
         * @param {string} pickerId - 选择器ID
         */
        confirmColor(pickerId) {
            this.close(pickerId);
        },

        /**
         * 打开颜色选择器
         * @param {string} pickerId - 选择器ID
         */
        open(pickerId) {
            const picker = document.getElementById(pickerId);
            if (picker) {
                picker.classList.add('active');
                picker.setAttribute('aria-hidden', 'false');
                this.initEvents(pickerId);
            }
        },

        /**
         * 关闭颜色选择器
         * @param {string} pickerId - 选择器ID
         */
        close(pickerId) {
            const picker = document.getElementById(pickerId);
            if (picker) {
                picker.classList.remove('active');
            }
        },

        /**
         * 切换颜色选择器显示/隐藏
         * @param {string} pickerId - 选择器ID
         */
        toggle(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;

            const isOpen = picker.classList.contains('active');

            // 关闭其他已打开的颜色选择器
            document.querySelectorAll('.t-color-picker.active').forEach(p => {
                if (p.id !== pickerId) {
                    p.classList.remove('active');
                    p.setAttribute('aria-hidden', 'true');
                }
            });

            if (isOpen) {
                this.close(pickerId);
            } else {
                this.open(pickerId);

                // 添加点击外部关闭
                setTimeout(() => {
                    const closeHandler = (e) => {
                        if (!picker.contains(e.target)) {
                            this.close(pickerId);
                            document.removeEventListener('click', closeHandler);
                        }
                    };
                    document.addEventListener('click', closeHandler);
                }, 0);
            }
        },

        /**
         * 初始化事件
         * @param {string} pickerId - 选择器ID
         */
        initEvents(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;

            // 初始化状态
            if (!this.states[pickerId]) {
                // 检查是否包含透明度滑块
                const alphaSlider = picker.querySelector('.t-color-alpha-slider');
                this.states[pickerId] = {
                    hue: 210,
                    saturation: 100,
                    value: 100,
                    alpha: alphaSlider ? 0.6 : 1
                };
            }

            // 初始化颜色盘背景
            this.updateSaturationBackground(pickerId);
            
            // 初始化光标位置
            this.updateCursors(pickerId);

            // 色盘事件
            const saturation = picker.querySelector('.t-color-saturation');
            if (saturation) {
                saturation.addEventListener('click', (e) => this.handleSaturationClick(pickerId, e));
                saturation.addEventListener('mousedown', (e) => this.startSaturationDrag(pickerId, e));
            }

            // 色谱事件
            const hueSlider = picker.querySelector('.t-color-hue-slider');
            if (hueSlider) {
                hueSlider.addEventListener('click', (e) => this.handleHueClick(pickerId, e));
                hueSlider.addEventListener('mousedown', (e) => this.startHueDrag(pickerId, e));
            }

            // 透明度滑块事件
            const alphaSlider = picker.querySelector('.t-color-alpha-slider');
            if (alphaSlider) {
                alphaSlider.addEventListener('click', (e) => this.handleAlphaClick(pickerId, e));
                alphaSlider.addEventListener('mousedown', (e) => this.startAlphaDrag(pickerId, e));
            }
        },

        /**
         * 处理色盘点击
         * @param {string} pickerId - 选择器ID
         * @param {Event} event - 点击事件
         */
        handleSaturationClick(pickerId, event) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;
            
            const saturation = picker.querySelector('.t-color-saturation');
            if (!saturation) return;
            
            const rect = saturation.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            const saturationValue = (x / rect.width) * 100;
            const value = 100 - (y / rect.height) * 100;
            
            this.updateColor(pickerId, {
                saturation: saturationValue,
                value: value
            });
        },

        /**
         * 开始色盘拖拽
         * @param {string} pickerId - 选择器ID
         * @param {Event} event - 鼠标事件
         */
        startSaturationDrag(pickerId, event) {
            event.preventDefault();
            
            const handleMouseMove = (e) => {
                this.handleSaturationClick(pickerId, e);
            };
            
            const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        },

        /**
         * 处理色谱点击
         * @param {string} pickerId - 选择器ID
         * @param {Event} event - 点击事件
         */
        handleHueClick(pickerId, event) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;
            
            const hueSlider = picker.querySelector('.t-color-hue-slider');
            if (!hueSlider) return;
            
            const rect = hueSlider.getBoundingClientRect();
            const y = event.clientY - rect.top;
            
            const hue = (y / rect.height) * 360;
            
            this.updateColor(pickerId, {
                hue: hue
            });
        },

        /**
         * 开始色谱拖拽
         * @param {string} pickerId - 选择器ID
         * @param {Event} event - 鼠标事件
         */
        startHueDrag(pickerId, event) {
            event.preventDefault();
            
            const handleMouseMove = (e) => {
                this.handleHueClick(pickerId, e);
            };
            
            const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        },

        /**
         * 处理透明度点击
         * @param {string} pickerId - 选择器ID
         * @param {Event} event - 点击事件
         */
        handleAlphaClick(pickerId, event) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;
            
            const alphaSlider = picker.querySelector('.t-color-alpha-slider');
            if (!alphaSlider) return;
            
            const rect = alphaSlider.getBoundingClientRect();
            let x = event.clientX - rect.left;
            
            // 限制x坐标在透明度条范围内
            x = Math.max(0, Math.min(x, rect.width-2));
            
            // 计算透明度值，步进为0.1
            let alpha = Math.round((x / rect.width) * 10) / 10;
            // 限制透明度在0.1到0.9之间
            alpha = Math.max(0.1, Math.min(0.9, alpha));
            
            this.updateColor(pickerId, {
                alpha: alpha
            });
        },

        /**
         * 开始透明度拖拽
         * @param {string} pickerId - 选择器ID
         * @param {Event} event - 鼠标事件
         */
        startAlphaDrag(pickerId, event) {
            event.preventDefault();
            
            const handleMouseMove = (e) => {
                this.handleAlphaClick(pickerId, e);
            };
            
            const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        },

        /**
         * 更新颜色
         * @param {string} pickerId - 选择器ID
         * @param {Object} changes - 颜色变化
         */
        updateColor(pickerId, changes) {
            const state = this.states[pickerId];
            if (!state) return;
            
            // 更新状态并限制范围
            if (changes.hue !== undefined) state.hue = Math.max(0, Math.min(360, changes.hue));
            if (changes.saturation !== undefined) state.saturation = Math.max(0, Math.min(100, changes.saturation));
            if (changes.value !== undefined) state.value = Math.max(0, Math.min(100, changes.value));
            if (changes.alpha !== undefined) {
                // 确保透明度值按照步进值0.1处理，保留小数点后1位
                let alpha = Math.round(changes.alpha * 10) / 10;
                // 限制透明度在0.1到0.9之间
                state.alpha = Math.max(0.1, Math.min(0.9, alpha));
            }
            
            // 转换为RGB
            const color = this.hsvToRgb(state.hue, state.saturation, state.value);
            const rgbaColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${state.alpha})`;
            const hexColor = this.rgbToHex(color.r, color.g, color.b);
            
            // 设置颜色
            this.setColor(pickerId, state.alpha < 1 ? rgbaColor : hexColor);
            
            // 更新颜色盘背景
            this.updateSaturationBackground(pickerId);
            
            // 更新光标位置
            this.updateCursors(pickerId);
        },

        /**
         * 更新颜色盘背景
         * @param {string} pickerId - 选择器ID
         */
        updateSaturationBackground(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;
            
            const state = this.states[pickerId];
            if (!state) return;
            
            // 获取当前色相的颜色
            const hueColor = this.hsvToRgb(state.hue, 100, 100);
            const hexColor = this.rgbToHex(hueColor.r, hueColor.g, hueColor.b);
            
            // 更新颜色盘背景
            const saturation = picker.querySelector('.t-color-saturation');
            if (saturation) {
                saturation.style.background = `linear-gradient(to right, white, ${hexColor}), linear-gradient(to top, black, transparent)`;
                saturation.style.backgroundBlendMode = 'multiply';
            }
            
            // 更新透明度背景
            const alphaBg = picker.querySelector('.t-color-alpha-bg');
            if (alphaBg) {
                alphaBg.style.backgroundImage = `linear-gradient(to right, rgba(${hueColor.r}, ${hueColor.g}, ${hueColor.b}, 0.2), rgba(${hueColor.r}, ${hueColor.g}, ${hueColor.b}, 0.8))`;
            }
        },

        /**
         * 更新光标位置
         * @param {string} pickerId - 选择器ID
         */
        updateCursors(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;
            
            const state = this.states[pickerId];
            if (!state) return;
            
            // 更新色盘光标
            const saturation = picker.querySelector('.t-color-saturation');
            const cursor = picker.querySelector('.t-color-cursor');
            if (saturation && cursor) {
                const rect = saturation.getBoundingClientRect();
                cursor.style.left = (state.saturation / 100) * rect.width + 'px';
                cursor.style.top = (1 - state.value / 100) * rect.height + 'px';
            }
            
            // 更新色谱光标
            const hueSlider = picker.querySelector('.t-color-hue-slider');
            const hueThumb = picker.querySelector('.t-color-hue-thumb');
            if (hueSlider && hueThumb) {
                const rect = hueSlider.getBoundingClientRect();
                hueThumb.style.top = (state.hue / 360) * rect.height + 'px';
            }
            
            // 更新透明度光标
            const alphaSlider = picker.querySelector('.t-color-alpha-slider');
            const alphaThumb = picker.querySelector('.t-color-alpha-thumb');
            if (alphaSlider && alphaThumb) {
                const rect = alphaSlider.getBoundingClientRect();
                // 将alpha值从[0.1, 0.9]映射到[3px, rect.width-5px]的范围
                const minAlpha = 0.1;
                const maxAlpha = 0.9;
                const normalizedAlpha = (state.alpha - minAlpha) / (maxAlpha - minAlpha);
                const left = normalizedAlpha * (rect.width - 14) + 3;
                alphaThumb.style.left = left + 'px';
            }
        },

        /**
         * HSV转RGB
         * @param {number} h - 色相 (0-360)
         * @param {number} s - 饱和度 (0-100)
         * @param {number} v - 明度 (0-100)
         * @returns {Object} RGB颜色
         */
        hsvToRgb(h, s, v) {
            s /= 100;
            v /= 100;
            
            const c = v * s;
            const x = c * (1 - Math.abs((h / 60) % 2 - 1));
            const m = v - c;
            
            let r, g, b;
            
            if (h >= 0 && h < 60) {
                r = c; g = x; b = 0;
            } else if (h >= 60 && h < 120) {
                r = x; g = c; b = 0;
            } else if (h >= 120 && h < 180) {
                r = 0; g = c; b = x;
            } else if (h >= 180 && h < 240) {
                r = 0; g = x; b = c;
            } else if (h >= 240 && h < 300) {
                r = x; g = 0; b = c;
            } else {
                r = c; g = 0; b = x;
            }
            
            return {
                r: Math.round((r + m) * 255),
                g: Math.round((g + m) * 255),
                b: Math.round((b + m) * 255)
            };
        },

        /**
         * RGB转HEX
         * @param {number} r - 红色 (0-255)
         * @param {number} g - 绿色 (0-255)
         * @param {number} b - 蓝色 (0-255)
         * @returns {string} HEX颜色
         */
        rgbToHex(r, g, b) {
            return '#' + [r, g, b].map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
        },

        /**
         * 设置颜色
         * @param {string} pickerId - 选择器ID
         * @param {string} color - 颜色值
         */
        setColor(pickerId, color) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;

            const block = picker.querySelector('.t-color-block, .t-color-picker__color-inner');
            const value = picker.querySelector('.t-color-value, .t-color-picker__value');
            const input = picker.querySelector('.t-color-input-group input, .t-color-picker__input');

            if (block) block.style.backgroundColor = color;
            if (value) value.textContent = color;
            if (input) input.value = color;

            picker.dispatchEvent(new CustomEvent('t:color:change', {
                detail: { color }
            }));
        }
    };

    // ==================== 主题切换 ====================
    
    const Theme = {
        current: 'light',

        /**
         * 切换主题
         * @param {string} theme - 主题名称 (light/dark)
         */
        set(theme) {
            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
                this.current = 'dark';
            } else {
                document.documentElement.removeAttribute('data-theme');
                this.current = 'light';
            }
            
            // 保存到本地存储
            try {
                localStorage.setItem('tbeui-theme', theme);
            } catch (e) {
                // 忽略存储错误
            }
            
            // 触发自定义事件
            document.dispatchEvent(new CustomEvent('tbeui:theme:change', {
                detail: { theme }
            }));
        },

        /**
         * 切换主题
         */
        toggle() {
            this.set(this.current === 'light' ? 'dark' : 'light');
        },

        /**
         * 初始化主题
         */
        init() {
            // 检查本地存储
            let savedTheme = null;
            try {
                savedTheme = localStorage.getItem('tbeui-theme');
            } catch (e) {
                // 忽略存储错误
            }
            
            // 检查系统偏好 - 已禁用自动切换，始终使用浅色主题
            if (!savedTheme) {
                savedTheme = 'light';
                // const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                // savedTheme = prefersDark ? 'dark' : 'light';
            }
            
            this.set(savedTheme);
            
            // 监听系统主题变化 - 已禁用自动切换
            // if (window.matchMedia) {
            //     window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            //         if (!localStorage.getItem('tbeui-theme')) {
            //             this.set(e.matches ? 'dark' : 'light');
            //         }
            //     });
            // }
        }
    };

    // ==================== Cascader 级联选择器组件 ====================

    const Cascader = {
        /**
         * 存储级联选择器状态
         */
        states: {},

        /**
         * 切换级联选择器（兼容旧版调用方式）
         * @param {string} cascaderId - 级联选择器ID
         */
        toggleCascader(cascaderId) {
            this.toggle(cascaderId);
        },

        /**
         * 选择第一级（兼容旧版调用方式）
         * @param {string} cascaderId - 级联选择器ID
         * @param {string} value - 选项值
         * @param {string} label - 选项标签
         */
        selectCascaderLevel1(cascaderId, value, label) {
            this.selectLevel1(cascaderId, value, label);
        },

        /**
         * 选择第二级（兼容旧版调用方式）
         * @param {string} cascaderId - 级联选择器ID
         * @param {string} parentKey - 父级Key
         * @param {string} key - Key
         * @param {string} name - 名称
         * @param {string} fullPath - 完整路径
         */
        selectCascaderLevel2(cascaderId, parentKey, key, name, fullPath) {
            // 兼容旧版调用，使用 name 作为 label
            this.selectLevel2(cascaderId, key, name);
        },

        /**
         * 最终选择（兼容旧版调用方式）
         * @param {string} cascaderId - 级联选择器ID
         * @param {string} fullPath - 完整路径
         */
        selectCascaderFinal(cascaderId, fullPath) {
            // 解析完整路径并设置值
            const labels = fullPath.split(' / ');
            const values = labels.map((_, index) => `level${index + 1}`);
            this.setValue(cascaderId, values, labels);

            const cascader = document.getElementById(cascaderId);
            if (cascader) {
                cascader.classList.remove('is-open');
                cascader.setAttribute('aria-expanded', 'false');

                cascader.dispatchEvent(new CustomEvent('t:cascader:select', {
                    detail: { value: values, label: labels }
                }));
            }
        },

        /**
         * 清空选择（兼容旧版调用方式）
         * @param {string} cascaderId - 级联选择器ID
         * @param {Event} event - 事件对象
         */
        clearCascader(cascaderId, event) {
            this.clear(cascaderId, event);
        },

        /**
         * 切换级联选择器
         * @param {string} cascaderId - 级联选择器ID
         */
        toggle(cascaderId) {
            const cascader = document.getElementById(cascaderId);
            if (!cascader || cascader.classList.contains('is-disabled')) return;
            
            const isOpen = cascader.classList.contains('is-open');
            
            // 关闭其他已打开的级联选择器
            document.querySelectorAll('.t-cascader.is-open').forEach(c => {
                if (c.id !== cascaderId) {
                    c.classList.remove('is-open');
                    c.setAttribute('aria-expanded', 'false');
                }
            });
            
            cascader.classList.toggle('is-open');
            cascader.setAttribute('aria-expanded', (!isOpen).toString());
            
            if (!isOpen) {
                // 初始化状态
                if (!this.states[cascaderId]) {
                    this.states[cascaderId] = {
                        selectedPath: [],
                        selectedLabels: []
                    };
                }
                
                setTimeout(() => {
                    const closeHandler = (e) => {
                        if (!cascader.contains(e.target)) {
                            cascader.classList.remove('is-open');
                            cascader.setAttribute('aria-expanded', 'false');
                            document.removeEventListener('click', closeHandler);
                        }
                    };
                    document.addEventListener('click', closeHandler);
                }, 0);
            }
        },
        
        /**
         * 选择第一级
         * @param {string} cascaderId - 级联选择器ID
         * @param {string} value - 选项值
         * @param {string} label - 选项标签
         */
        selectLevel1(cascaderId, value, label) {
            const cascader = document.getElementById(cascaderId);
            if (!cascader) return;

            const state = this.states[cascaderId] || { selectedPath: [], selectedLabels: [] };
            state.selectedPath = [value];
            state.selectedLabels = [label];
            this.states[cascaderId] = state;

            // 更新第一级选中状态
            const menu1 = cascader.querySelector('.t-cascader__menu:first-child');
            if (menu1) {
                menu1.querySelectorAll('.t-cascader__option').forEach(opt => {
                    const isActive = opt.dataset.value === value;
                    opt.classList.toggle('is-active', isActive);
                });
            }

            // 获取二级菜单数据并渲染
            const level2Data = this.getLevel2Data(value);
            this.renderLevel2Menu(cascaderId, level2Data);

            // 触发事件
            cascader.dispatchEvent(new CustomEvent('t:cascader:change', {
                detail: { value: state.selectedPath, label: state.selectedLabels }
            }));
        },

        /**
         * 获取二级菜单数据
         * @param {string} parentValue - 父级值
         * @returns {Array} 二级菜单数据
         */
        getLevel2Data(parentValue) {
            // 示例数据，实际使用时可从外部传入
            const data = {
                'guide': [
                    { value: 'design', label: '设计原则' },
                    { value: 'nav', label: '导航' }
                ],
                'component': [
                    { value: 'basic', label: '基础组件' },
                    { value: 'form', label: '表单组件' }
                ]
            };
            return data[parentValue] || [];
        },

        /**
         * 渲染二级菜单
         * @param {string} cascaderId - 级联选择器ID
         * @param {Array} data - 二级菜单数据
         */
        renderLevel2Menu(cascaderId, data) {
            const cascader = document.getElementById(cascaderId);
            if (!cascader) return;

            const dropdown = cascader.querySelector('.t-cascader__dropdown');
            if (!dropdown) return;

            // 移除旧的二级菜单
            const oldMenu2 = dropdown.querySelector('.t-cascader__menu--level2');
            if (oldMenu2) {
                oldMenu2.remove();
            }

            // 如果没有数据，不创建二级菜单
            if (!data || data.length === 0) return;

            // 创建二级菜单
            const menu2 = document.createElement('div');
            menu2.className = 't-cascader__menu t-cascader__menu--level2';

            data.forEach(item => {
                const option = document.createElement('div');
                option.className = 't-cascader__option';
                option.dataset.value = item.value;
                option.innerHTML = `${item.label}<span class="t-cascader__option-arrow">▶</span>`;
                option.onclick = () => this.selectLevel2(cascaderId, item.value, item.label);
                menu2.appendChild(option);
            });

            dropdown.appendChild(menu2);
        },
        
        /**
         * 选择第二级
         * @param {string} cascaderId - 级联选择器ID
         * @param {string} value - 选项值
         * @param {string} label - 选项标签
         */
        selectLevel2(cascaderId, value, label) {
            const cascader = document.getElementById(cascaderId);
            if (!cascader) return;

            const state = this.states[cascaderId] || { selectedPath: [], selectedLabels: [] };
            state.selectedPath[1] = value;
            state.selectedLabels[1] = label;
            this.states[cascaderId] = state;

            // 更新第二级选中状态
            const menu2 = cascader.querySelector('.t-cascader__menu--level2');
            if (menu2) {
                menu2.querySelectorAll('.t-cascader__option').forEach(opt => {
                    const isActive = opt.dataset.value === value;
                    opt.classList.toggle('is-active', isActive);
                });
            }

            // 获取三级菜单数据并渲染
            const parentValue = state.selectedPath[0];
            const level3Data = this.getLevel3Data(parentValue, value);
            this.renderLevel3Menu(cascaderId, level3Data);

            // 触发事件
            cascader.dispatchEvent(new CustomEvent('t:cascader:change', {
                detail: { value: state.selectedPath, label: state.selectedLabels }
            }));
        },

        /**
         * 获取三级菜单数据
         * @param {string} parentValue - 父级值
         * @param {string} value - 当前值
         * @returns {Array} 三级菜单数据
         */
        getLevel3Data(parentValue, value) {
            // 示例数据，实际使用时可从外部传入
            const data = {
                'guide': {
                    'design': [
                        { value: 'consistent', label: '一致' },
                        { value: 'feedback', label: '反馈' },
                        { value: 'efficiency', label: '效率' }
                    ],
                    'nav': [
                        { value: 'top', label: '顶部导航' },
                        { value: 'side', label: '侧边导航' }
                    ]
                },
                'component': {
                    'basic': [
                        { value: 'button', label: 'Button 按钮' },
                        { value: 'icon', label: 'Icon 图标' }
                    ],
                    'form': [
                        { value: 'input', label: 'Input 输入框' },
                        { value: 'select', label: 'Select 选择器' }
                    ]
                }
            };
            return (data[parentValue] && data[parentValue][value]) || [];
        },

        /**
         * 渲染三级菜单
         * @param {string} cascaderId - 级联选择器ID
         * @param {Array} data - 三级菜单数据
         */
        renderLevel3Menu(cascaderId, data) {
            const cascader = document.getElementById(cascaderId);
            if (!cascader) return;

            const dropdown = cascader.querySelector('.t-cascader__dropdown');
            if (!dropdown) return;

            // 移除旧的三级菜单
            const oldMenu3 = dropdown.querySelector('.t-cascader__menu--level3');
            if (oldMenu3) {
                oldMenu3.remove();
            }

            // 如果没有数据，不创建三级菜单
            if (!data || data.length === 0) return;

            // 创建三级菜单
            const menu3 = document.createElement('div');
            menu3.className = 't-cascader__menu t-cascader__menu--level3';

            data.forEach(item => {
                const option = document.createElement('div');
                option.className = 't-cascader__option';
                option.dataset.value = item.value;
                option.textContent = item.label;
                option.onclick = () => this.selectLevel3(cascaderId, item.value, item.label);
                menu3.appendChild(option);
            });

            dropdown.appendChild(menu3);
        },
        
        /**
         * 选择第三级（最终选择）
         * @param {string} cascaderId - 级联选择器ID
         * @param {string} value - 选项值
         * @param {string} label - 选项标签
         */
        selectLevel3(cascaderId, value, label) {
            const cascader = document.getElementById(cascaderId);
            if (!cascader) return;
            
            const state = this.states[cascaderId] || { selectedPath: [], selectedLabels: [] };
            state.selectedPath[2] = value;
            state.selectedLabels[2] = label;
            this.states[cascaderId] = state;
            
            // 更新输入框
            const input = document.getElementById(cascaderId + '-input');
            if (input) {
                input.value = state.selectedLabels.join(' / ');
                input.setAttribute('data-value', state.selectedPath.join(','));
            }
            
            // 关闭选择器
            cascader.classList.remove('is-open');
            cascader.setAttribute('aria-expanded', 'false');
            
            // 触发事件
            cascader.dispatchEvent(new CustomEvent('t:cascader:select', {
                detail: { value: state.selectedPath, label: state.selectedLabels }
            }));
        },
        
        /**
         * 清空选择
         * @param {string} cascaderId - 级联选择器ID
         * @param {Event} event - 事件对象
         */
        clear(cascaderId, event) {
            if (event) event.stopPropagation();
            
            const cascader = document.getElementById(cascaderId);
            if (!cascader) return;
            
            // 重置状态
            this.states[cascaderId] = { selectedPath: [], selectedLabels: [] };
            
            // 清空输入框
            const input = document.getElementById(cascaderId + '-input');
            if (input) {
                input.value = '';
                input.removeAttribute('data-value');
            }
            
            // 重置选中状态
            cascader.querySelectorAll('.t-cascader__option.is-active').forEach(opt => {
                opt.classList.remove('is-active');
            });
            
            // 触发事件
            cascader.dispatchEvent(new CustomEvent('t:cascader:clear'));
        },
        
        /**
         * 设置值
         * @param {string} cascaderId - 级联选择器ID
         * @param {Array} values - 值数组
         * @param {Array} labels - 标签数组
         */
        setValue(cascaderId, values, labels) {
            this.states[cascaderId] = {
                selectedPath: values,
                selectedLabels: labels
            };
            
            const input = document.getElementById(cascaderId + '-input');
            if (input) {
                input.value = labels.join(' / ');
                input.setAttribute('data-value', values.join(','));
            }
        },
        
        /**
         * 获取值
         * @param {string} cascaderId - 级联选择器ID
         * @returns {Object} 选中的值和标签
         */
        getValue(cascaderId) {
            const state = this.states[cascaderId] || { selectedPath: [], selectedLabels: [] };
            return {
                value: state.selectedPath,
                label: state.selectedLabels
            };
        }
    };

    // ==================== TimePicker 时间选择器组件 ====================
    
    const TimePicker = {
        /**
         * 存储时间选择器状态
         */
        states: {},
        currentPicker: null,
        
        /**
         * 切换时间选择器
         * @param {string} pickerId - 选择器ID
         */
        toggle(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker || picker.classList.contains('is-disabled')) return;
            
            // 关闭其他已打开的时间选择器
            document.querySelectorAll('.t-time-picker.is-open').forEach(p => {
                if (p.id !== pickerId) {
                    p.classList.remove('is-open');
                    p.setAttribute('aria-expanded', 'false');
                }
            });
            
            const isOpen = picker.classList.contains('is-open');
            picker.classList.toggle('is-open');
            picker.setAttribute('aria-expanded', (!isOpen).toString());
            
            if (!isOpen) {
                this.currentPicker = pickerId;
                
                // 初始化状态
                if (!this.states[pickerId]) {
                    this.states[pickerId] = {
                        selectedHour: '00',
                        selectedMinute: '00',
                        selectedSecond: '00'
                    };
                }
                
                setTimeout(() => {
                    const closeHandler = (e) => {
                        if (!picker.contains(e.target)) {
                            picker.classList.remove('is-open');
                            picker.setAttribute('aria-expanded', 'false');
                            this.currentPicker = null;
                            document.removeEventListener('click', closeHandler);
                        }
                    };
                    document.addEventListener('click', closeHandler);
                }, 0);
            } else {
                this.currentPicker = null;
            }
        },
        
        /**
         * 选择时间（完整时间）
         * @param {string} pickerId - 选择器ID
         * @param {string} time - 时间字符串 (HH:mm)
         */
        selectTime(pickerId, time) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;
            
            const input = document.getElementById(pickerId + '-input');
            if (input) {
                input.value = time;
            }
            
            // 更新选中状态 - 查找panel内的所有item
            const panel = picker.querySelector('.t-time-picker__panel');
            if (panel) {
                panel.querySelectorAll('.t-time-picker__item').forEach(item => {
                    item.classList.toggle('is-selected', item.textContent === time);
                });
            }
            
            // 解析时间并更新状态
            const parts = time.split(':');
            if (parts.length >= 2) {
                this.states[pickerId] = {
                    selectedHour: parts[0],
                    selectedMinute: parts[1],
                    selectedSecond: parts[2] || '00'
                };
            }
            
            picker.dispatchEvent(new CustomEvent('t:time:change', {
                detail: { time }
            }));
        },
        
        /**
         * 选择小时
         * @param {string} pickerId - 选择器ID
         * @param {string} hour - 小时
         */
        selectHour(pickerId, hour) {
            const state = this.states[pickerId] || { selectedHour: '00', selectedMinute: '00' };
            state.selectedHour = hour;
            this.states[pickerId] = state;
            
            // 更新选中状态 - 查找第一个column（小时列）
            const picker = document.getElementById(pickerId);
            const columns = picker?.querySelectorAll('.t-time-picker__column');
            if (columns && columns.length > 0) {
                // 第一个column是小时列
                const hoursColumn = columns[0];
                hoursColumn.querySelectorAll('.t-time-picker__item').forEach(item => {
                    item.classList.toggle('is-selected', item.textContent === hour);
                });
            }
            
            this._updateInput(pickerId);
        },
        
        /**
         * 选择分钟
         * @param {string} pickerId - 选择器ID
         * @param {string} minute - 分钟
         */
        selectMinute(pickerId, minute) {
            const state = this.states[pickerId] || { selectedHour: '00', selectedMinute: '00' };
            state.selectedMinute = minute;
            this.states[pickerId] = state;
            
            // 更新选中状态 - 查找第三个column（分钟列，跳过冒号列）
            const picker = document.getElementById(pickerId);
            const columns = picker?.querySelectorAll('.t-time-picker__column');
            if (columns && columns.length >= 3) {
                // 第三个column是分钟列（第一个是小时，第二个是冒号，第三个是分钟）
                const minutesColumn = columns[2];
                minutesColumn.querySelectorAll('.t-time-picker__item').forEach(item => {
                    item.classList.toggle('is-selected', item.textContent === minute);
                });
            }
            
            this._updateInput(pickerId);
        },
        
        /**
         * 选择秒
         * @param {string} pickerId - 选择器ID
         * @param {string} second - 秒
         */
        selectSecond(pickerId, second) {
            const state = this.states[pickerId] || { selectedHour: '00', selectedMinute: '00', selectedSecond: '00' };
            state.selectedSecond = second;
            this.states[pickerId] = state;
            
            // 更新选中状态
            const picker = document.getElementById(pickerId);
            const secondsColumn = picker?.querySelector('.t-time-picker__seconds, [data-type="seconds"]');
            if (secondsColumn) {
                secondsColumn.querySelectorAll('.t-time-picker__item').forEach(item => {
                    item.classList.toggle('is-selected', item.textContent === second);
                });
            }
            
            this._updateInput(pickerId);
        },
        
        /**
         * 更新输入框
         * @private
         * @param {string} pickerId - 选择器ID
         */
        _updateInput(pickerId) {
            const state = this.states[pickerId] || { selectedHour: '00', selectedMinute: '00' };
            const time = state.selectedHour + ':' + state.selectedMinute;
            
            const input = document.getElementById(pickerId + '-input');
            if (input) {
                input.value = time;
            }
            
            const picker = document.getElementById(pickerId);
            picker?.dispatchEvent(new CustomEvent('t:time:change', {
                detail: { time, hour: state.selectedHour, minute: state.selectedMinute }
            }));
        },
        
        /**
         * 确认选择
         * @param {string} pickerId - 选择器ID
         */
        confirm(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;
            
            picker.classList.remove('is-open');
            picker.setAttribute('aria-expanded', 'false');
            this.currentPicker = null;
            
            const state = this.states[pickerId] || {};
            picker.dispatchEvent(new CustomEvent('t:time:confirm', {
                detail: { 
                    time: state.selectedHour + ':' + state.selectedMinute,
                    hour: state.selectedHour,
                    minute: state.selectedMinute
                }
            }));
        },
        
        /**
         * 取消选择
         * @param {string} pickerId - 选择器ID
         */
        cancel(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;
            
            picker.classList.remove('is-open');
            picker.setAttribute('aria-expanded', 'false');
            this.currentPicker = null;
            
            picker.dispatchEvent(new CustomEvent('t:time:cancel'));
        },
        
        /**
         * 设置值
         * @param {string} pickerId - 选择器ID
         * @param {string} time - 时间字符串 (HH:mm:ss)
         */
        setValue(pickerId, time) {
            const parts = time.split(':');
            this.states[pickerId] = {
                selectedHour: parts[0] || '00',
                selectedMinute: parts[1] || '00',
                selectedSecond: parts[2] || '00'
            };
            
            const input = document.getElementById(pickerId + '-input');
            if (input) {
                input.value = time;
            }
        },
        
        /**
         * 获取值
         * @param {string} pickerId - 选择器ID
         * @returns {string} 时间字符串
         */
        getValue(pickerId) {
            const state = this.states[pickerId] || { selectedHour: '00', selectedMinute: '00' };
            return state.selectedHour + ':' + state.selectedMinute;
        }
    };

    // ==================== DatePicker 日期选择器组件 ====================
    
    const DatePicker = {
        /**
         * 存储日期选择器状态
         */
        states: {},
        currentPicker: null,
        
        /**
         * 切换日期选择器
         * @param {string} pickerId - 选择器ID
         */
        toggle(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker || picker.classList.contains('is-disabled')) return;
            
            // 关闭其他已打开的日期选择器
            document.querySelectorAll('.t-date-picker.is-open').forEach(p => {
                if (p.id !== pickerId) {
                    p.classList.remove('is-open');
                    p.setAttribute('aria-expanded', 'false');
                }
            });
            
            const isOpen = picker.classList.contains('is-open');
            picker.classList.toggle('is-open');
            picker.setAttribute('aria-expanded', (!isOpen).toString());
            
            if (!isOpen) {
                this.currentPicker = pickerId;
                
                // 检查是否是范围选择模式
                const isRange = picker.classList.contains('is-range');
                
                // 初始化状态
                if (!this.states[pickerId]) {
                    this.states[pickerId] = {
                        currentDate: new Date(),
                        selectedDate: null,
                        selectedEndDate: null,
                        isRange: isRange,
                        selectingStart: true // 范围选择时，true表示正在选择开始日期
                    };
                } else {
                    this.states[pickerId].isRange = isRange;
                }
                
                // 渲染日历
                this.render(pickerId);
                
                setTimeout(() => {
                    const closeHandler = (e) => {
                        if (!picker.contains(e.target)) {
                            picker.classList.remove('is-open');
                            picker.setAttribute('aria-expanded', 'false');
                            this.currentPicker = null;
                            document.removeEventListener('click', closeHandler);
                        }
                    };
                    document.addEventListener('click', closeHandler);
                }, 0);
            } else {
                this.currentPicker = null;
            }
        },
        
        /**
         * 渲染日历
         * @param {string} pickerId - 选择器ID
         */
        render(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;
            
            const state = this.states[pickerId];
            if (!state) return;
            
            const year = state.currentDate.getFullYear();
            const month = state.currentDate.getMonth();
            
            // 更新头部
            const header = document.getElementById(pickerId + '-header');
            if (header) {
                header.textContent = year + '年 ' + (month + 1) + '月';
            }
            
            // 获取该月第一天和最后一天
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startDayOfWeek = firstDay.getDay();
            
            // 获取上个月的日期
            const prevMonthLastDay = new Date(year, month, 0).getDate();
            
            // 生成日期格子
            const daysContainer = document.getElementById(pickerId + '-days');
            if (!daysContainer) return;
            
            daysContainer.innerHTML = '';
            
            // 上个月的日期
            for (let i = startDayOfWeek - 1; i >= 0; i--) {
                const day = prevMonthLastDay - i;
                const dayEl = this._createDayElement(day, true);
                daysContainer.appendChild(dayEl);
            }
            
            // 当月的日期
            const today = new Date();
            for (let day = 1; day <= daysInMonth; day++) {
                const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
                const isSelected = state.selectedDate && 
                    year === state.selectedDate.getFullYear() && 
                    month === state.selectedDate.getMonth() && 
                    day === state.selectedDate.getDate();
                
                // 范围选择模式下的结束日期选中状态
                const isEndSelected = state.isRange && state.selectedEndDate && 
                    year === state.selectedEndDate.getFullYear() && 
                    month === state.selectedEndDate.getMonth() && 
                    day === state.selectedEndDate.getDate();
                
                // 范围选择模式下，判断日期是否在范围内
                const isInRange = state.isRange && state.selectedDate && state.selectedEndDate && 
                    !state.selectingStart &&
                    new Date(year, month, day) > state.selectedDate && 
                    new Date(year, month, day) < state.selectedEndDate;
                
                const dayEl = this._createDayElement(day, false, isToday, isSelected || isEndSelected, pickerId, isInRange);
                daysContainer.appendChild(dayEl);
            }
            
            // 下个月的日期
            const remainingCells = 42 - (startDayOfWeek + daysInMonth);
            for (let day = 1; day <= remainingCells; day++) {
                const dayEl = this._createDayElement(day, true);
                daysContainer.appendChild(dayEl);
            }
        },
        
        /**
         * 创建日期元素
         * @private
         * @param {number} day - 日期
         * @param {boolean} isOtherMonth - 是否其他月份
         * @param {boolean} isToday - 是否今天
         * @param {boolean} isSelected - 是否选中
         * @param {string} pickerId - 选择器ID
         * @param {boolean} isInRange - 是否在范围内（范围选择模式）
         * @returns {HTMLElement} 日期元素
         */
        _createDayElement(day, isOtherMonth, isToday = false, isSelected = false, pickerId = null, isInRange = false) {
            const dayEl = document.createElement('div');
            dayEl.className = 't-date-picker__day';
            
            const numberSpan = document.createElement('span');
            numberSpan.className = 't-date-picker__day-number';
            numberSpan.textContent = day;
            dayEl.appendChild(numberSpan);
            
            if (isOtherMonth) {
                dayEl.classList.add('is-other-month');
            }
            if (isToday) {
                dayEl.classList.add('is-today');
            }
            if (isSelected) {
                dayEl.classList.add('is-selected');
            }
            if (isInRange) {
                dayEl.classList.add('is-in-range');
            }
            
            if (pickerId && !isOtherMonth) {
                dayEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectDate(pickerId, day);
                });
            }
            
            return dayEl;
        },
        
        /**
         * 选择日期
         * @param {string} pickerId - 选择器ID
         * @param {number} day - 日期
         */
        selectDate(pickerId, day) {
            const state = this.states[pickerId];
            if (!state) return;
            
            const selectedDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth(), day);
            const picker = document.getElementById(pickerId);
            
            // 如果是范围选择模式
            if (state.isRange) {
                if (state.selectingStart) {
                    // 选择开始日期
                    state.selectedDate = selectedDate;
                    state.selectingStart = false;
                    
                    // 更新开始日期输入框
                    const startInput = document.getElementById(pickerId + '-start');
                    if (startInput) {
                        const year = selectedDate.getFullYear();
                        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                        const date = String(day).padStart(2, '0');
                        startInput.value = year + '-' + month + '-' + date;
                    }
                    
                    // 重新渲染日历以显示选中状态
                    this.render(pickerId);
                    
                    // 触发开始日期选择事件
                    picker.dispatchEvent(new CustomEvent('t:date:start-change', {
                        detail: { date: selectedDate }
                    }));
                    
                    return; // 不关闭面板，继续选择结束日期
                } else {
                    // 选择结束日期
                    state.selectedEndDate = selectedDate;
                    state.selectingStart = true; // 重置为选择开始日期
                    
                    // 确保结束日期不早于开始日期
                    if (state.selectedDate && selectedDate < state.selectedDate) {
                        // 如果选择的结束日期早于开始日期，交换它们
                        const temp = state.selectedDate;
                        state.selectedDate = selectedDate;
                        state.selectedEndDate = temp;
                    }
                    
                    // 更新结束日期输入框
                    const endInput = document.getElementById(pickerId + '-end');
                    if (endInput) {
                        const year = state.selectedEndDate.getFullYear();
                        const month = String(state.selectedEndDate.getMonth() + 1).padStart(2, '0');
                        const date = String(state.selectedEndDate.getDate()).padStart(2, '0');
                        endInput.value = year + '-' + month + '-' + date;
                    }
                    
                    // 重新渲染日历
                    this.render(pickerId);
                    
                    // 关闭面板
                    picker.classList.remove('is-open');
                    picker.setAttribute('aria-expanded', 'false');
                    this.currentPicker = null;
                    
                    // 触发范围选择完成事件
                    picker.dispatchEvent(new CustomEvent('t:date:range-change', {
                        detail: { 
                            startDate: state.selectedDate,
                            endDate: state.selectedEndDate
                        }
                    }));
                    
                    return;
                }
            }
            
            // 普通单日期选择模式
            state.selectedDate = selectedDate;
            
            // 更新输入框（使用 -start 后缀）
            const input = document.getElementById(pickerId + '-start') || document.getElementById(pickerId + '-input');
            if (input) {
                const year = state.selectedDate.getFullYear();
                const month = String(state.selectedDate.getMonth() + 1).padStart(2, '0');
                const date = String(day).padStart(2, '0');
                input.value = year + '-' + month + '-' + date;
            }
            
            // 重新渲染日历
            this.render(pickerId);
            
            // 关闭面板
            picker.classList.remove('is-open');
            picker.setAttribute('aria-expanded', 'false');
            this.currentPicker = null;
            
            // 触发事件
            picker.dispatchEvent(new CustomEvent('t:date:change', {
                detail: { date: state.selectedDate }
            }));
        },
        
        /**
         * 切换月份
         * @param {string} pickerId - 选择器ID
         * @param {number} delta - 月份变化量
         */
        changeMonth(pickerId, delta) {
            const state = this.states[pickerId];
            if (!state) return;
            
            state.currentDate.setMonth(state.currentDate.getMonth() + delta);
            this.render(pickerId);
        },
        
        /**
         * 选择快捷选项
         * @param {string} pickerId - 选择器ID
         * @param {string} type - 快捷类型 (today, yesterday, week)
         */
        selectShortcut(pickerId, type) {
            const today = new Date();
            let targetDate = new Date(today);
            
            switch(type) {
                case 'today':
                    break;
                case 'yesterday':
                    targetDate.setDate(today.getDate() - 1);
                    break;
                case 'week':
                    targetDate.setDate(today.getDate() - 7);
                    break;
            }
            
            const state = this.states[pickerId];
            if (!state) return;
            
            state.currentDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
            state.selectedDate = targetDate;
            
            // 更新输入框
            const input = document.getElementById(pickerId + '-start') || document.getElementById(pickerId + '-input');
            if (input) {
                const year = targetDate.getFullYear();
                const month = String(targetDate.getMonth() + 1).padStart(2, '0');
                const date = String(targetDate.getDate()).padStart(2, '0');
                input.value = year + '-' + month + '-' + date;
            }
            
            // 重新渲染并关闭
            this.render(pickerId);
            
            const picker = document.getElementById(pickerId);
            picker.classList.remove('is-open');
            picker.setAttribute('aria-expanded', 'false');
            this.currentPicker = null;
            
            // 触发事件
            picker.dispatchEvent(new CustomEvent('t:date:change', {
                detail: { date: targetDate }
            }));
        },
        
        /**
         * 设置值
         * @param {string} pickerId - 选择器ID
         * @param {Date|string} date - 日期
         */
        setValue(pickerId, date) {
            const d = typeof date === 'string' ? new Date(date) : date;
            
            this.states[pickerId] = {
                currentDate: new Date(d.getFullYear(), d.getMonth(), 1),
                selectedDate: d
            };
            
            const input = document.getElementById(pickerId + '-input');
            if (input) {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                input.value = year + '-' + month + '-' + day;
            }
        },
        
        /**
         * 获取值
         * @param {string} pickerId - 选择器ID
         * @returns {Date|null} 选中的日期
         */
        getValue(pickerId) {
            const state = this.states[pickerId];
            return state ? state.selectedDate : null;
        }
    };

    // ==================== DateTimePicker 日期时间选择器组件 ====================
    
    const DateTimePicker = {
        /**
         * 存储日期时间选择器状态
         */
        states: {},
        currentPicker: null,
        
        /**
         * 切换日期时间选择器
         * @param {string} pickerId - 选择器ID
         */
        toggle(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker || picker.classList.contains('is-disabled')) return;
            
            // 关闭其他已打开的日期时间选择器
            document.querySelectorAll('.t-datetime-picker.is-open').forEach(p => {
                if (p.id !== pickerId) {
                    p.classList.remove('is-open');
                    p.setAttribute('aria-expanded', 'false');
                }
            });
            
            const isOpen = picker.classList.contains('is-open');
            picker.classList.toggle('is-open');
            picker.setAttribute('aria-expanded', (!isOpen).toString());
            
            if (!isOpen) {
                this.currentPicker = pickerId;

                // 检查是否是范围选择模式
                const isRange = picker.classList.contains('t-datetime-picker--range');

                // 初始化状态
                if (!this.states[pickerId]) {
                    this.states[pickerId] = {
                        currentDate: new Date(),
                        selectedDate: null,
                        selectedEndDate: null,
                        isRange: isRange,
                        selectingStart: true,
                        selectedHour: '09',
                        selectedMinute: '00'
                    };
                }

                // 渲染日历
                this.render(pickerId);
                
                setTimeout(() => {
                    const closeHandler = (e) => {
                        if (!picker.contains(e.target)) {
                            picker.classList.remove('is-open');
                            picker.setAttribute('aria-expanded', 'false');
                            this.currentPicker = null;
                            document.removeEventListener('click', closeHandler);
                        }
                    };
                    document.addEventListener('click', closeHandler);
                }, 0);
            } else {
                this.currentPicker = null;
            }
        },
        
        /**
         * 渲染日历
         * @param {string} pickerId - 选择器ID
         */
        render(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;
            
            const state = this.states[pickerId];
            if (!state) return;
            
            const year = state.currentDate.getFullYear();
            const month = state.currentDate.getMonth();
            
            // 更新头部
            const header = document.getElementById(pickerId + '-header');
            if (header) {
                header.textContent = year + '年 ' + (month + 1) + '月';
            }
            
            // 获取该月第一天和最后一天
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startDayOfWeek = firstDay.getDay();
            
            // 获取上个月的日期
            const prevMonthLastDay = new Date(year, month, 0).getDate();
            
            // 生成日期格子
            const daysContainer = document.getElementById(pickerId + '-days');
            if (!daysContainer) return;
            
            daysContainer.innerHTML = '';
            
            // 上个月的日期
            for (let i = startDayOfWeek - 1; i >= 0; i--) {
                const day = prevMonthLastDay - i;
                const dayEl = this._createDayElement(day, true);
                daysContainer.appendChild(dayEl);
            }
            
            // 当月的日期
            const today = new Date();
            for (let day = 1; day <= daysInMonth; day++) {
                const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
                const isSelected = state.selectedDate &&
                    year === state.selectedDate.getFullYear() &&
                    month === state.selectedDate.getMonth() &&
                    day === state.selectedDate.getDate();

                // 范围选择模式下的结束日期选中状态
                const isEndSelected = state.isRange && state.selectedEndDate &&
                    year === state.selectedEndDate.getFullYear() &&
                    month === state.selectedEndDate.getMonth() &&
                    day === state.selectedEndDate.getDate();

                // 范围选择模式下，判断日期是否在范围内
                const isInRange = state.isRange && state.selectedDate && state.selectedEndDate &&
                    !state.selectingStart &&
                    new Date(year, month, day) > state.selectedDate &&
                    new Date(year, month, day) < state.selectedEndDate;

                const dayEl = this._createDayElement(day, false, isToday, isSelected || isEndSelected, pickerId, isInRange);
                daysContainer.appendChild(dayEl);
            }
            
            // 下个月的日期
            const remainingCells = 42 - (startDayOfWeek + daysInMonth);
            for (let day = 1; day <= remainingCells; day++) {
                const dayEl = this._createDayElement(day, true);
                daysContainer.appendChild(dayEl);
            }
        },
        
        /**
         * 创建日期元素
         * @private
         * @param {number} day - 日期
         * @param {boolean} isOtherMonth - 是否其他月份
         * @param {boolean} isToday - 是否今天
         * @param {boolean} isSelected - 是否选中
         * @param {string} pickerId - 选择器ID
         * @param {boolean} isInRange - 是否在范围内
         * @returns {HTMLElement} 日期元素
         */
        _createDayElement(day, isOtherMonth, isToday = false, isSelected = false, pickerId = null, isInRange = false) {
            const dayEl = document.createElement('div');
            dayEl.className = 't-date-picker__day';

            const numberSpan = document.createElement('span');
            numberSpan.className = 't-date-picker__day-number';
            numberSpan.textContent = day;
            dayEl.appendChild(numberSpan);

            if (isOtherMonth) {
                dayEl.classList.add('is-other-month');
            }
            if (isToday) {
                dayEl.classList.add('is-today');
            }
            if (isSelected) {
                dayEl.classList.add('is-selected');
            }
            if (isInRange) {
                dayEl.classList.add('is-in-range');
            }

            if (pickerId && !isOtherMonth) {
                dayEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectDate(pickerId, day);
                });
            }

            return dayEl;
        },
        
        /**
         * 选择日期
         * @param {string} pickerId - 选择器ID
         * @param {number} day - 日期
         */
        selectDate(pickerId, day) {
            const state = this.states[pickerId];
            if (!state) return;

            const selectedDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth(), day);

            // 如果是范围选择模式
            if (state.isRange) {
                if (state.selectingStart) {
                    // 选择开始日期
                    state.selectedDate = selectedDate;
                    state.selectingStart = false;

                    // 更新开始日期输入框
                    const startInput = document.getElementById(pickerId + '-start');
                    if (startInput) {
                        const year = selectedDate.getFullYear();
                        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                        const dateStr = String(day).padStart(2, '0');
                        startInput.value = year + '-' + month + '-' + dateStr;
                    }

                    // 重新渲染日历以显示选中状态
                    setTimeout(() => {
                        this.render(pickerId);
                    }, 0);

                    return; // 不关闭面板，继续选择结束日期
                } else {
                    // 选择结束日期
                    state.selectedEndDate = selectedDate;
                    state.selectingStart = true; // 重置为选择开始日期

                    // 确保结束日期不早于开始日期
                    if (state.selectedDate && selectedDate < state.selectedDate) {
                        const temp = state.selectedDate;
                        state.selectedDate = selectedDate;
                        state.selectedEndDate = temp;
                    }

                    // 更新结束日期输入框
                    const endInput = document.getElementById(pickerId + '-end');
                    if (endInput) {
                        const year = state.selectedEndDate.getFullYear();
                        const month = String(state.selectedEndDate.getMonth() + 1).padStart(2, '0');
                        const dateStr = String(state.selectedEndDate.getDate()).padStart(2, '0');
                        endInput.value = year + '-' + month + '-' + dateStr;
                    }

                    // 关闭面板
                    const picker = document.getElementById(pickerId);
                    if (picker) {
                        picker.classList.remove('is-open');
                        picker.setAttribute('aria-expanded', 'false');
                    }
                    this.currentPicker = null;

                    return;
                }
            }

            // 非范围模式
            state.selectedDate = selectedDate;

            // 更新输入框
            const input = document.getElementById(pickerId + '-input');
            if (input) {
                const year = selectedDate.getFullYear();
                const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const dateStr = String(day).padStart(2, '0');
                input.value = year + '-' + month + '-' + dateStr;
            }

            // 使用 setTimeout 延迟渲染，避免事件处理冲突
            setTimeout(() => {
                this.render(pickerId);
            }, 0);
        },
        
        /**
         * 选择小时
         * @param {string} pickerId - 选择器ID
         * @param {string} hour - 小时
         */
        selectHour(pickerId, hour) {
            const state = this.states[pickerId];
            if (!state) return;
            
            state.selectedHour = hour;
            
            // 更新选中状态 - 使用ID选择器
            const hoursColumn = document.getElementById(pickerId + '-hours');
            if (hoursColumn) {
                hoursColumn.querySelectorAll('.t-datetime-picker__time-item').forEach(item => {
                    item.classList.toggle('is-selected', item.textContent === hour);
                });
            }
        },
        
        /**
         * 选择分钟
         * @param {string} pickerId - 选择器ID
         * @param {string} minute - 分钟
         */
        selectMinute(pickerId, minute) {
            const state = this.states[pickerId];
            if (!state) return;
            
            state.selectedMinute = minute;
            
            // 更新选中状态 - 使用ID选择器
            const minutesColumn = document.getElementById(pickerId + '-minutes');
            if (minutesColumn) {
                minutesColumn.querySelectorAll('.t-datetime-picker__time-item').forEach(item => {
                    item.classList.toggle('is-selected', item.textContent === minute);
                });
            }
        },
        
        /**
         * 确认选择
         * @param {string} pickerId - 选择器ID
         */
        confirm(pickerId) {
            const state = this.states[pickerId];
            if (!state) return;
            
            if (state.selectedDate) {
                const year = state.selectedDate.getFullYear();
                const month = String(state.selectedDate.getMonth() + 1).padStart(2, '0');
                const date = String(state.selectedDate.getDate()).padStart(2, '0');
                const time = state.selectedHour + ':' + state.selectedMinute;
                
                const input = document.getElementById(pickerId + '-input');
                if (input) {
                    input.value = year + '-' + month + '-' + date + ' ' + time;
                }
                
                const picker = document.getElementById(pickerId);
                picker.dispatchEvent(new CustomEvent('t:datetime:confirm', {
                    detail: { 
                        date: state.selectedDate,
                        time: time,
                        datetime: year + '-' + month + '-' + date + ' ' + time
                    }
                }));
            }
            
            const picker = document.getElementById(pickerId);
            picker.classList.remove('is-open');
            picker.setAttribute('aria-expanded', 'false');
            this.currentPicker = null;
        },
        
        /**
         * 取消选择
         * @param {string} pickerId - 选择器ID
         */
        cancel(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;
            
            picker.classList.remove('is-open');
            picker.setAttribute('aria-expanded', 'false');
            this.currentPicker = null;
            
            picker.dispatchEvent(new CustomEvent('t:datetime:cancel'));
        },
        
        /**
         * 切换月份
         * @param {string} pickerId - 选择器ID
         * @param {number} delta - 月份变化量
         */
        changeMonth(pickerId, delta) {
            const state = this.states[pickerId];
            if (!state) return;
            
            state.currentDate.setMonth(state.currentDate.getMonth() + delta);
            this.render(pickerId);
        },
        
        /**
         * 设置值
         * @param {string} pickerId - 选择器ID
         * @param {Date|string} datetime - 日期时间
         */
        setValue(pickerId, datetime) {
            const d = typeof datetime === 'string' ? new Date(datetime) : datetime;
            
            this.states[pickerId] = {
                currentDate: new Date(d.getFullYear(), d.getMonth(), 1),
                selectedDate: d,
                selectedHour: String(d.getHours()).padStart(2, '0'),
                selectedMinute: String(d.getMinutes()).padStart(2, '0')
            };
            
            const input = document.getElementById(pickerId + '-input');
            if (input) {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const date = String(d.getDate()).padStart(2, '0');
                const time = this.states[pickerId].selectedHour + ':' + this.states[pickerId].selectedMinute;
                input.value = year + '-' + month + '-' + date + ' ' + time;
            }
        },
        
        /**
         * 获取值
         * @param {string} pickerId - 选择器ID
         * @returns {Object} 日期时间对象
         */
        getValue(pickerId) {
            const state = this.states[pickerId];
            if (!state || !state.selectedDate) return null;
            
            return {
                date: state.selectedDate,
                time: state.selectedHour + ':' + state.selectedMinute,
                datetime: state.selectedDate.getFullYear() + '-' + 
                         String(state.selectedDate.getMonth() + 1).padStart(2, '0') + '-' +
                         String(state.selectedDate.getDate()).padStart(2, '0') + ' ' +
                         state.selectedHour + ':' + state.selectedMinute
            };
        }
    };

    // ==================== Upload 上传组件 ====================
    
    const Upload = {
        /**
         * 存储上传组件状态
         */
        states: {},
        
        /**
         * 初始化上传组件
         */
        init() {
            // 监听文件输入变化
            document.querySelectorAll('.t-upload__input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const uploadId = input.closest('.t-upload')?.id;
                    if (uploadId) {
                        this.handleFileSelect(uploadId, e.target.files);
                    }
                });
            });
            
            // 拖拽上传
            document.querySelectorAll('.t-upload--drag').forEach(upload => {
                const uploadId = upload.id;
                if (!uploadId) return;
                
                upload.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    upload.classList.add('is-dragover');
                });
                
                upload.addEventListener('dragleave', (e) => {
                    e.preventDefault();
                    upload.classList.remove('is-dragover');
                });
                
                upload.addEventListener('drop', (e) => {
                    e.preventDefault();
                    upload.classList.remove('is-dragover');
                    
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                        this.handleFileSelect(uploadId, files);
                    }
                });
            });
        },
        
        /**
         * 处理文件选择
         * @param {string} uploadId - 上传组件ID
         * @param {FileList} files - 文件列表
         */
        handleFileSelect(uploadId, files) {
            const upload = document.getElementById(uploadId);
            if (!upload) return;
            
            // 初始化状态
            if (!this.states[uploadId]) {
                this.states[uploadId] = {
                    files: [],
                    fileList: []
                };
            }
            
            const state = this.states[uploadId];
            const fileList = upload.querySelector('.t-upload__file-list');
            
            Array.from(files).forEach(file => {
                const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                const fileItem = {
                    id: fileId,
                    file: file,
                    name: file.name,
                    size: file.size,
                    status: 'ready', // ready, uploading, success, error
                    progress: 0
                };
                
                state.fileList.push(fileItem);
                
                // 添加到文件列表显示
                if (fileList) {
                    this.addFileToList(fileList, fileItem, uploadId);
                }
            });
            
            // 触发事件
            upload.dispatchEvent(new CustomEvent('t:upload:select', {
                detail: { files: state.fileList }
            }));
            
            // 自动上传（如果配置了action）
            const action = upload.dataset.action;
            if (action) {
                this.upload(uploadId, action);
            }
        },
        
        /**
         * 添加文件到列表
         * @param {HTMLElement} fileList - 文件列表容器
         * @param {Object} fileItem - 文件项
         * @param {string} uploadId - 上传组件ID
         */
        addFileToList(fileList, fileItem, uploadId) {
            const li = document.createElement('li');
            li.className = 't-upload__file-item t-border-box--inset-sm';
            li.dataset.fileId = fileItem.id;
            
            const size = this.formatFileSize(fileItem.size);
            
            li.innerHTML = `
                <span class="t-upload__file-name">${fileItem.name}</span>
                <span class="t-upload__file-size">${size}</span>
                <span class="t-upload__file-status">${fileItem.status}</span>
                <div class="t-upload__file-progress" style="display: none;">
                    <div class="t-upload__file-progress-bar" style="width: 0%"></div>
                </div>
                <button class="t-upload__file-remove" onclick="TbeUI.Upload.removeFile('${uploadId}', '${fileItem.id}')">
                    <i class="t-icon-close"></i>
                </button>
            `;
            
            fileList.appendChild(li);
        },
        
        /**
         * 格式化文件大小
         * @param {number} bytes - 字节数
         * @returns {string} 格式化后的文件大小
         */
        formatFileSize(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        
        /**
         * 移除文件
         * @param {string} uploadId - 上传组件ID
         * @param {string} fileId - 文件ID
         */
        removeFile(uploadId, fileId) {
            const state = this.states[uploadId];
            if (!state) return;
            
            const index = state.fileList.findIndex(f => f.id === fileId);
            if (index > -1) {
                state.fileList.splice(index, 1);
            }
            
            const upload = document.getElementById(uploadId);
            const fileItem = upload?.querySelector(`[data-file-id="${fileId}"]`);
            if (fileItem) {
                fileItem.remove();
            }
            
            // 触发事件
            upload.dispatchEvent(new CustomEvent('t:upload:remove', {
                detail: { fileId }
            }));
        },
        
        /**
         * 上传文件
         * @param {string} uploadId - 上传组件ID
         * @param {string} action - 上传地址
         */
        upload(uploadId, action) {
            const state = this.states[uploadId];
            if (!state || state.fileList.length === 0) return;
            
            const upload = document.getElementById(uploadId);
            const autoUpload = upload?.dataset.autoUpload !== 'false';
            
            state.fileList.forEach(fileItem => {
                if (fileItem.status !== 'ready') return;
                
                fileItem.status = 'uploading';
                this.updateFileStatus(uploadId, fileItem.id, 'uploading');
                
                const formData = new FormData();
                formData.append('file', fileItem.file);
                
                const xhr = new XMLHttpRequest();
                
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const progress = Math.round((e.loaded / e.total) * 100);
                        fileItem.progress = progress;
                        this.updateFileProgress(uploadId, fileItem.id, progress);
                    }
                });
                
                xhr.addEventListener('load', () => {
                    if (xhr.status === 200) {
                        fileItem.status = 'success';
                        this.updateFileStatus(uploadId, fileItem.id, 'success');
                        
                        upload.dispatchEvent(new CustomEvent('t:upload:success', {
                            detail: { file: fileItem, response: xhr.response }
                        }));
                    } else {
                        fileItem.status = 'error';
                        this.updateFileStatus(uploadId, fileItem.id, 'error');
                        
                        upload.dispatchEvent(new CustomEvent('t:upload:error', {
                            detail: { file: fileItem, error: xhr.statusText }
                        }));
                    }
                });
                
                xhr.addEventListener('error', () => {
                    fileItem.status = 'error';
                    this.updateFileStatus(uploadId, fileItem.id, 'error');
                    
                    upload.dispatchEvent(new CustomEvent('t:upload:error', {
                        detail: { file: fileItem, error: 'Network error' }
                    }));
                });
                
                xhr.open('POST', action);
                xhr.send(formData);
            });
        },
        
        /**
         * 更新文件状态
         * @param {string} uploadId - 上传组件ID
         * @param {string} fileId - 文件ID
         * @param {string} status - 状态
         */
        updateFileStatus(uploadId, fileId, status) {
            const upload = document.getElementById(uploadId);
            const fileItem = upload?.querySelector(`[data-file-id="${fileId}"]`);
            if (!fileItem) return;
            
            const statusEl = fileItem.querySelector('.t-upload__file-status');
            if (statusEl) {
                const statusText = {
                    'ready': '待上传',
                    'uploading': '上传中',
                    'success': '上传成功',
                    'error': '上传失败'
                };
                statusEl.textContent = statusText[status] || status;
                statusEl.className = 't-upload__file-status is-' + status;
            }
        },
        
        /**
         * 更新文件进度
         * @param {string} uploadId - 上传组件ID
         * @param {string} fileId - 文件ID
         * @param {number} progress - 进度百分比
         */
        updateFileProgress(uploadId, fileId, progress) {
            const upload = document.getElementById(uploadId);
            const fileItem = upload?.querySelector(`[data-file-id="${fileId}"]`);
            if (!fileItem) return;
            
            const progressEl = fileItem.querySelector('.t-upload__file-progress');
            const progressBar = fileItem.querySelector('.t-upload__file-progress-bar');
            
            if (progressEl && progressBar) {
                progressEl.style.display = 'block';
                progressBar.style.width = progress + '%';
            }
        },
        
        /**
         * 清空文件列表
         * @param {string} uploadId - 上传组件ID
         */
        clearFiles(uploadId) {
            const state = this.states[uploadId];
            if (state) {
                state.fileList = [];
            }
            
            const upload = document.getElementById(uploadId);
            const fileList = upload?.querySelector('.t-upload__file-list');
            if (fileList) {
                fileList.innerHTML = '';
            }
            
            // 清空input
            const input = upload?.querySelector('.t-upload__input');
            if (input) {
                input.value = '';
            }
        },
        
        /**
         * 获取文件列表
         * @param {string} uploadId - 上传组件ID
         * @returns {Array} 文件列表
         */
        getFileList(uploadId) {
            const state = this.states[uploadId];
            return state ? state.fileList : [];
        }
    };

    // ==================== Form 表单组件 ====================
    
    const Form = {
        /**
         * 存储表单状态
         */
        states: {},
        
        /**
         * 初始化表单组件
         */
        init() {
            document.querySelectorAll('.t-form').forEach(form => {
                const formId = form.id;
                if (!formId) return;
                
                // 初始化表单状态
                this.states[formId] = {
                    fields: {},
                    errors: {},
                    rules: this.parseRules(form)
                };
                
                // 监听表单提交
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.submit(formId);
                });
                
                // 监听字段变化进行实时验证
                form.querySelectorAll('[data-validate]').forEach(field => {
                    field.addEventListener('blur', () => {
                        this.validateField(formId, field);
                    });
                });
            });
        },
        
        /**
         * 解析表单验证规则
         * @param {HTMLElement} form - 表单元素
         * @returns {Object} 验证规则
         */
        parseRules(form) {
            const rules = {};
            
            form.querySelectorAll('[data-validate]').forEach(field => {
                const fieldName = field.name;
                if (!fieldName) return;
                
                const validateRules = field.dataset.validate.split('|');
                rules[fieldName] = [];
                
                validateRules.forEach(rule => {
                    const [ruleName, ruleValue] = rule.split(':');
                    rules[fieldName].push({
                        type: ruleName,
                        value: ruleValue,
                        message: field.dataset.message || this.getDefaultMessage(ruleName, ruleValue)
                    });
                });
            });
            
            return rules;
        },
        
        /**
         * 获取默认错误消息
         * @param {string} ruleType - 规则类型
         * @param {string} ruleValue - 规则值
         * @returns {string} 错误消息
         */
        getDefaultMessage(ruleType, ruleValue) {
            const messages = {
                'required': '该字段不能为空',
                'email': '请输入有效的邮箱地址',
                'min': '长度不能少于' + ruleValue + '个字符',
                'max': '长度不能超过' + ruleValue + '个字符',
                'phone': '请输入有效的手机号码',
                'number': '请输入数字'
            };
            return messages[ruleType] || '验证失败';
        },
        
        /**
         * 验证单个字段
         * @param {string} formId - 表单ID
         * @param {HTMLElement} field - 字段元素
         * @returns {boolean} 验证结果
         */
        validateField(formId, field) {
            const state = this.states[formId];
            if (!state) return true;
            
            const fieldName = field.name;
            const value = field.value.trim();
            const rules = state.rules[fieldName];
            
            if (!rules) return true;
            
            for (const rule of rules) {
                const isValid = this.checkRule(value, rule);
                
                if (!isValid) {
                    this.showError(formId, field, rule.message);
                    state.errors[fieldName] = rule.message;
                    return false;
                }
            }
            
            this.clearError(formId, field);
            delete state.errors[fieldName];
            return true;
        },
        
        /**
         * 检查规则
         * @param {string} value - 字段值
         * @param {Object} rule - 规则对象
         * @returns {boolean} 验证结果
         */
        checkRule(value, rule) {
            switch(rule.type) {
                case 'required':
                    return value.length > 0;
                case 'email':
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                case 'phone':
                    return /^1[3-9]\d{9}$/.test(value);
                case 'min':
                    return value.length >= parseInt(rule.value);
                case 'max':
                    return value.length <= parseInt(rule.value);
                case 'number':
                    return !isNaN(value) && value !== '';
                default:
                    return true;
            }
        },
        
        /**
         * 显示错误信息
         * @param {string} formId - 表单ID
         * @param {HTMLElement} field - 字段元素
         * @param {string} message - 错误消息
         */
        showError(formId, field, message) {
            const formItem = field.closest('.t-form-item');
            if (!formItem) return;
            
            formItem.classList.add('is-error');
            
            let errorEl = formItem.querySelector('.t-form__error');
            if (!errorEl) {
                errorEl = document.createElement('div');
                errorEl.className = 't-form__error';
                formItem.appendChild(errorEl);
            }
            errorEl.textContent = message;
        },
        
        /**
         * 清除错误信息
         * @param {string} formId - 表单ID
         * @param {HTMLElement} field - 字段元素
         */
        clearError(formId, field) {
            const formItem = field.closest('.t-form-item');
            if (!formItem) return;
            
            formItem.classList.remove('is-error');
            
            const errorEl = formItem.querySelector('.t-form__error');
            if (errorEl) {
                errorEl.remove();
            }
        },
        
        /**
         * 验证整个表单
         * @param {string} formId - 表单ID
         * @returns {boolean} 验证结果
         */
        validate(formId) {
            const form = document.getElementById(formId);
            const state = this.states[formId];
            
            if (!form || !state) return false;
            
            let isValid = true;
            state.errors = {};
            
            form.querySelectorAll('[data-validate]').forEach(field => {
                if (!this.validateField(formId, field)) {
                    isValid = false;
                }
            });
            
            return isValid;
        },
        
        /**
         * 提交表单
         * @param {string} formId - 表单ID
         */
        submit(formId) {
            if (!this.validate(formId)) {
                return;
            }
            
            const form = document.getElementById(formId);
            const state = this.states[formId];
            
            if (!form) return;
            
            // 收集表单数据
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // 触发提交事件
            form.dispatchEvent(new CustomEvent('t:form:submit', {
                detail: { data }
            }));
            
            // 如果有action属性，执行提交
            const action = form.getAttribute('action');
            const method = form.getAttribute('method') || 'POST';
            
            if (action) {
                this.sendRequest(formId, action, method, data);
            }
        },
        
        /**
         * 发送请求
         * @param {string} formId - 表单ID
         * @param {string} url - 请求地址
         * @param {string} method - 请求方法
         * @param {Object} data - 请求数据
         */
        sendRequest(formId, url, method, data) {
            const form = document.getElementById(formId);
            
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                form.dispatchEvent(new CustomEvent('t:form:success', {
                    detail: { result }
                }));
            })
            .catch(error => {
                form.dispatchEvent(new CustomEvent('t:form:error', {
                    detail: { error }
                }));
            });
        },
        
        /**
         * 重置表单
         * @param {string} formId - 表单ID
         */
        reset(formId) {
            const form = document.getElementById(formId);
            const state = this.states[formId];
            
            if (!form) return;
            
            form.reset();
            
            if (state) {
                state.errors = {};
            }
            
            // 清除所有错误显示
            form.querySelectorAll('.t-form-item.is-error').forEach(item => {
                item.classList.remove('is-error');
                const errorEl = item.querySelector('.t-form__error');
                if (errorEl) {
                    errorEl.remove();
                }
            });
            
            form.dispatchEvent(new CustomEvent('t:form:reset'));
        },
        
        /**
         * 设置字段值
         * @param {string} formId - 表单ID
         * @param {string} fieldName - 字段名
         * @param {any} value - 字段值
         */
        setFieldValue(formId, fieldName, value) {
            const form = document.getElementById(formId);
            if (!form) return;
            
            const field = form.querySelector('[name="' + fieldName + '"]');
            if (field) {
                field.value = value;
            }
        },
        
        /**
         * 获取字段值
         * @param {string} formId - 表单ID
         * @param {string} fieldName - 字段名
         * @returns {any} 字段值
         */
        getFieldValue(formId, fieldName) {
            const form = document.getElementById(formId);
            if (!form) return null;
            
            const field = form.querySelector('[name="' + fieldName + '"]');
            return field ? field.value : null;
        },
        
        /**
         * 获取表单数据
         * @param {string} formId - 表单ID
         * @returns {Object} 表单数据
         */
        getFormData(formId) {
            const form = document.getElementById(formId);
            if (!form) return {};
            
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            return data;
        },
        
        /**
         * 改变表单标签对齐方式
         * @param {string} formId - 表单ID
         * @param {string} position - 对齐方式 (left/right/top)
         */
        changeLabelPosition(formId, position) {
            const form = document.getElementById(formId);
            if (!form) return;
            
            // 移除所有对齐类
            form.classList.remove('t-form--label-left', 't-form--label-right', 't-form--label-top');
            
            // 添加新的对齐类
            form.classList.add('t-form--label-' + position);
            
            // 触发事件
            form.dispatchEvent(new CustomEvent('t:form:labelPositionChange', {
                detail: { position: position }
            }));
        }
    };

    // ==================== Pagination 分页组件 ====================

    const Pagination = {
        /**
         * 存储分页状态
         */
        states: {},

        /**
         * 创建分页组件
         */
        create(containerId, options = {}) {
            const container = document.getElementById(containerId);
            if (!container) return;

            const {
                total = 0,
                pageSize = 10,
                currentPage = 1,
                pagerCount = 7,
                hideOnSinglePage = false,
                disabled = false,
                background = false,
                small = false,
                onChange = null,
                onSizeChange = null
            } = options;

            const totalPages = Math.ceil(total / pageSize);

            // 如果只有一页且 hideOnSinglePage 为 true，则隐藏
            if (hideOnSinglePage && totalPages <= 1) {
                container.style.display = 'none';
                return;
            }

            container.style.display = '';

            // 存储状态
            this.states[containerId] = {
                total,
                pageSize,
                currentPage,
                pagerCount,
                hideOnSinglePage,
                disabled,
                background,
                small,
                onChange,
                onSizeChange,
                totalPages
            };

            this.render(containerId);
        },

        /**
         * 渲染分页组件
         */
        render(containerId) {
            const container = document.getElementById(containerId);
            const state = this.states[containerId];
            if (!container || !state) return;

            const { total, pageSize, currentPage, pagerCount, disabled, background, small, totalPages } = state;

            container.innerHTML = '';
            container.className = 't-pagination';

            if (background) container.classList.add('t-pagination--background');
            if (small) container.classList.add('t-pagination--small');
            if (disabled) container.classList.add('is-disabled');

            // 上一页按钮
            const prevBtn = document.createElement('button');
            prevBtn.className = 't-pagination__btn t-pagination__prev';
            prevBtn.disabled = disabled || currentPage <= 1;
            prevBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';
            prevBtn.onclick = () => this.changePage(containerId, currentPage - 1);
            container.appendChild(prevBtn);

            // 页码按钮
            const pager = document.createElement('div');
            pager.className = 't-pagination__pager';

            const pages = this.getPageNumbers(currentPage, totalPages, pagerCount);
            pages.forEach(page => {
                if (page === '...') {
                    const ellipsis = document.createElement('span');
                    ellipsis.className = 't-pagination__ellipsis';
                    ellipsis.textContent = '...';
                    pager.appendChild(ellipsis);
                } else {
                    const btn = document.createElement('button');
                    btn.className = 't-pagination__number' + (page === currentPage ? ' active' : '');
                    btn.textContent = page;
                    btn.disabled = disabled;
                    btn.onclick = () => this.changePage(containerId, page);
                    pager.appendChild(btn);
                }
            });

            container.appendChild(pager);

            // 下一页按钮
            const nextBtn = document.createElement('button');
            nextBtn.className = 't-pagination__btn t-pagination__next';
            nextBtn.disabled = disabled || currentPage >= totalPages;
            nextBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>';
            nextBtn.onclick = () => this.changePage(containerId, currentPage + 1);
            container.appendChild(nextBtn);

            // 每页条数选择器
            if (background) {
                const sizes = [10, 20, 50, 100];
                const sizeSelect = document.createElement('select');
                sizeSelect.className = 't-pagination__sizes';
                sizeSelect.disabled = disabled;
                sizes.forEach(size => {
                    const option = document.createElement('option');
                    option.value = size;
                    option.textContent = size + ' 条/页';
                    if (size === pageSize) option.selected = true;
                    sizeSelect.appendChild(option);
                });
                sizeSelect.onchange = (e) => this.changePageSize(containerId, parseInt(e.target.value));
                container.appendChild(sizeSelect);
            }
        },

        /**
         * 获取页码数组
         */
        getPageNumbers(current, total, pagerCount) {
            if (total <= pagerCount) {
                return Array.from({ length: total }, (_, i) => i + 1);
            }

            const pages = [];
            const half = Math.floor(pagerCount / 2);
            let start = Math.max(1, current - half);
            let end = Math.min(total, start + pagerCount - 1);

            if (end - start < pagerCount - 1) {
                start = Math.max(1, end - pagerCount + 1);
            }

            if (start > 1) {
                pages.push(1);
                if (start > 2) pages.push('...');
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < total) {
                if (end < total - 1) pages.push('...');
                pages.push(total);
            }

            return pages;
        },

        /**
         * 切换页码
         */
        changePage(containerId, page) {
            const state = this.states[containerId];
            if (!state || state.disabled) return;

            const { totalPages, onChange } = state;
            if (page < 1 || page > totalPages) return;

            state.currentPage = page;
            this.render(containerId);

            if (onChange) {
                onChange(page);
            }
        },

        /**
         * 切换每页条数
         */
        changePageSize(containerId, pageSize) {
            const state = this.states[containerId];
            if (!state || state.disabled) return;

            state.pageSize = pageSize;
            state.currentPage = 1;
            state.totalPages = Math.ceil(state.total / pageSize);

            // 重新渲染以更新分页器
            this.render(containerId);

            if (state.onSizeChange) {
                state.onSizeChange(pageSize);
            }
            if (state.onChange) {
                state.onChange(1);
            }
        }
    };

    // ==================== Transfer 穿梭框组件 ====================
    
    const Transfer = {
        /**
         * 存储穿梭框状态
         */
        states: {},
        
        /**
         * 初始化穿梭框
         */
        init() {
            document.querySelectorAll('.t-transfer').forEach(transfer => {
                const transferId = transfer.id;
                if (!transferId) return;
                
                // 初始化状态
                this.states[transferId] = {
                    leftData: [],
                    rightData: [],
                    leftChecked: [],
                    rightChecked: []
                };
                
                // 解析初始数据
                this.parseData(transferId);
            });
        },
        
        /**
         * 解析初始数据
         * @param {string} transferId - 穿梭框ID
         */
        parseData(transferId) {
            const transfer = document.getElementById(transferId);
            if (!transfer) return;
            
            const state = this.states[transferId];
            
            // 解析左侧数据
            const leftPanel = transfer.querySelector('.t-transfer__panel--left');
            if (leftPanel) {
                leftPanel.querySelectorAll('.t-transfer__item').forEach(item => {
                    state.leftData.push({
                        key: item.dataset.key,
                        label: item.textContent.trim(),
                        disabled: item.classList.contains('is-disabled')
                    });
                });
            }
            
            // 解析右侧数据
            const rightPanel = transfer.querySelector('.t-transfer__panel--right');
            if (rightPanel) {
                rightPanel.querySelectorAll('.t-transfer__item').forEach(item => {
                    state.rightData.push({
                        key: item.dataset.key,
                        label: item.textContent.trim(),
                        disabled: item.classList.contains('is-disabled')
                    });
                });
            }
        },
        
        /**
         * 切换选中状态
         * @param {string} transferId - 穿梭框ID
         * @param {string} direction - 方向 (left/right)
         * @param {string} key - 数据key
         */
        toggleCheck(transferId, direction, key) {
            const state = this.states[transferId];
            if (!state) return;
            
            const checkedArray = direction === 'left' ? state.leftChecked : state.rightChecked;
            const index = checkedArray.indexOf(key);
            
            if (index > -1) {
                checkedArray.splice(index, 1);
            } else {
                checkedArray.push(key);
            }
            
            // 更新UI
            this.updateCheckUI(transferId, direction, key);
            
            // 更新全选状态
            this.updateCheckAllState(transferId, direction);
        },
        
        /**
         * 更新选中UI
         * @param {string} transferId - 穿梭框ID
         * @param {string} direction - 方向
         * @param {string} key - 数据key
         */
        updateCheckUI(transferId, direction, key) {
            const transfer = document.getElementById(transferId);
            if (!transfer) return;
            
            const panel = transfer.querySelector('.t-transfer__panel--' + direction);
            const item = panel?.querySelector(`[data-key="${key}"]`);
            
            if (item) {
                item.classList.toggle('is-checked');
            }
        },
        
        /**
         * 全选/取消全选
         * @param {string} transferId - 穿梭框ID
         * @param {string} direction - 方向
         */
        checkAll(transferId, direction) {
            const state = this.states[transferId];
            if (!state) return;
            
            const dataArray = direction === 'left' ? state.leftData : state.rightData;
            const checkedArray = direction === 'left' ? state.leftChecked : state.rightChecked;
            const allChecked = checkedArray.length === dataArray.filter(d => !d.disabled).length;
            
            if (allChecked) {
                // 取消全选
                checkedArray.length = 0;
            } else {
                // 全选
                checkedArray.length = 0;
                dataArray.forEach(item => {
                    if (!item.disabled) {
                        checkedArray.push(item.key);
                    }
                });
            }
            
            // 更新UI
            this.renderPanel(transferId, direction);
            this.updateCheckAllState(transferId, direction);
        },
        
        /**
         * 更新全选状态
         * @param {string} transferId - 穿梭框ID
         * @param {string} direction - 方向
         */
        updateCheckAllState(transferId, direction) {
            const transfer = document.getElementById(transferId);
            const state = this.states[transferId];
            if (!transfer || !state) return;
            
            const panel = transfer.querySelector('.t-transfer__panel--' + direction);
            const checkAllCheckbox = panel?.querySelector('.t-transfer__header .t-checkbox');
            
            if (checkAllCheckbox) {
                const dataArray = direction === 'left' ? state.leftData : state.rightData;
                const checkedArray = direction === 'left' ? state.leftChecked : state.rightChecked;
                const availableItems = dataArray.filter(d => !d.disabled);
                
                checkAllCheckbox.classList.toggle('is-checked', checkedArray.length === availableItems.length && availableItems.length > 0);
                checkAllCheckbox.classList.toggle('is-indeterminate', checkedArray.length > 0 && checkedArray.length < availableItems.length);
            }
            
            // 更新计数
            const countEl = panel?.querySelector('.t-transfer__count');
            if (countEl) {
                const checkedArray = direction === 'left' ? state.leftChecked : state.rightChecked;
                const dataArray = direction === 'left' ? state.leftData : state.rightData;
                countEl.textContent = checkedArray.length + '/' + dataArray.length;
            }
        },
        
        /**
         * 移动到右侧
         * @param {string} transferId - 穿梭框ID
         */
        toRight(transferId) {
            const state = this.states[transferId];
            if (!state || state.leftChecked.length === 0) return;
            
            // 移动数据
            const itemsToMove = state.leftData.filter(item => state.leftChecked.includes(item.key));
            state.rightData.push(...itemsToMove);
            state.leftData = state.leftData.filter(item => !state.leftChecked.includes(item.key));
            
            // 清空选中
            state.leftChecked = [];
            
            // 重新渲染
            this.renderPanel(transferId, 'left');
            this.renderPanel(transferId, 'right');
            
            // 触发事件
            const transfer = document.getElementById(transferId);
            transfer.dispatchEvent(new CustomEvent('t:transfer:change', {
                detail: { leftData: state.leftData, rightData: state.rightData }
            }));
        },
        
        /**
         * 移动到左侧
         * @param {string} transferId - 穿梭框ID
         */
        toLeft(transferId) {
            const state = this.states[transferId];
            if (!state || state.rightChecked.length === 0) return;
            
            // 移动数据
            const itemsToMove = state.rightData.filter(item => state.rightChecked.includes(item.key));
            state.leftData.push(...itemsToMove);
            state.rightData = state.rightData.filter(item => !state.rightChecked.includes(item.key));
            
            // 清空选中
            state.rightChecked = [];
            
            // 重新渲染
            this.renderPanel(transferId, 'left');
            this.renderPanel(transferId, 'right');
            
            // 触发事件
            const transfer = document.getElementById(transferId);
            transfer.dispatchEvent(new CustomEvent('t:transfer:change', {
                detail: { leftData: state.leftData, rightData: state.rightData }
            }));
        },
        
        /**
         * 渲染面板
         * @param {string} transferId - 穿梭框ID
         * @param {string} direction - 方向
         */
        renderPanel(transferId, direction) {
            const transfer = document.getElementById(transferId);
            const state = this.states[transferId];
            if (!transfer || !state) return;
            
            const panel = transfer.querySelector('.t-transfer__panel--' + direction);
            const list = panel?.querySelector('.t-transfer__list');
            if (!list) return;
            
            const dataArray = direction === 'left' ? state.leftData : state.rightData;
            const checkedArray = direction === 'left' ? state.leftChecked : state.rightChecked;
            
            list.innerHTML = '';
            
            dataArray.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 't-transfer__item';
                itemEl.dataset.key = item.key;
                
                if (item.disabled) {
                    itemEl.classList.add('is-disabled');
                }
                if (checkedArray.includes(item.key)) {
                    itemEl.classList.add('is-checked');
                }
                
                itemEl.innerHTML = `
                    <label class="t-checkbox ${checkedArray.includes(item.key) ? 'is-checked' : ''}">
                        <span class="t-checkbox__input">
                            <span class="t-checkbox__inner"></span>
                        </span>
                        <span class="t-checkbox__label">${item.label}</span>
                    </label>
                `;
                
                if (!item.disabled) {
                    itemEl.addEventListener('click', () => {
                        this.toggleCheck(transferId, direction, item.key);
                    });
                }
                
                list.appendChild(itemEl);
            });
            
            // 更新计数和全选状态
            this.updateCheckAllState(transferId, direction);
        },
        
        /**
         * 设置数据
         * @param {string} transferId - 穿梭框ID
         * @param {Array} leftData - 左侧数据
         * @param {Array} rightData - 右侧数据
         */
        setData(transferId, leftData, rightData) {
            const state = this.states[transferId];
            if (!state) return;
            
            state.leftData = leftData || [];
            state.rightData = rightData || [];
            state.leftChecked = [];
            state.rightChecked = [];
            
            this.renderPanel(transferId, 'left');
            this.renderPanel(transferId, 'right');
        },
        
        /**
         * 获取数据
         * @param {string} transferId - 穿梭框ID
         * @returns {Object} 数据对象
         */
        getData(transferId) {
            const state = this.states[transferId];
            if (!state) return { leftData: [], rightData: [] };
            
            return {
                leftData: state.leftData,
                rightData: state.rightData
            };
        }
    };

    // ==================== Popover 弹出框组件 ====================
    
    const Popover = {
        /**
         * 存储弹出框状态
         */
        states: {},

        /**
         * 初始化弹出框
         */
        init() {
            // 点击外部关闭
            document.addEventListener('click', (e) => {
                document.querySelectorAll('.t-popover.is-visible').forEach(popover => {
                    const trigger = document.querySelector(`[data-popover="${popover.id}"]`);
                    if (trigger && !trigger.contains(e.target) && !popover.contains(e.target)) {
                        this.hide(popover.id);
                    }
                });
            });

            // Hover 触发初始化
            document.querySelectorAll('.t-popover--hover').forEach(popover => {
                popover.addEventListener('mouseenter', () => {
                    if (!popover.classList.contains('is-disabled')) {
                        popover.classList.add('active');
                    }
                });
                popover.addEventListener('mouseleave', () => {
                    popover.classList.remove('active');
                });
            });
        },
        
        /**
         * 显示弹出框
         * @param {string} popoverId - 弹出框ID
         * @param {HTMLElement} trigger - 触发元素
         */
        show(popoverId, trigger) {
            const popover = document.getElementById(popoverId);
            if (!popover) return;
            
            // 关闭其他弹出框
            document.querySelectorAll('.t-popover.is-visible').forEach(p => {
                if (p.id !== popoverId) {
                    p.classList.remove('is-visible');
                }
            });
            
            popover.classList.add('is-visible');
            
            // 定位
            if (trigger) {
                this.position(popover, trigger);
            }
            
            // 触发事件
            popover.dispatchEvent(new CustomEvent('t:popover:show'));
        },
        
        /**
         * 隐藏弹出框
         * @param {string} popoverId - 弹出框ID
         */
        hide(popoverId) {
            const popover = document.getElementById(popoverId);
            if (!popover) return;
            
            popover.classList.remove('is-visible');
            
            // 触发事件
            popover.dispatchEvent(new CustomEvent('t:popover:hide'));
        },
        
        /**
         * 切换弹出框
         * @param {string} popoverId - 弹出框ID
         * @param {HTMLElement} trigger - 触发元素
         */
        toggle(popoverId, trigger) {
            const popover = document.getElementById(popoverId);
            if (!popover) return;
            
            if (popover.classList.contains('is-visible')) {
                this.hide(popoverId);
            } else {
                this.show(popoverId, trigger);
            }
        },
        
        /**
         * 定位弹出框
         * @param {HTMLElement} popover - 弹出框元素
         * @param {HTMLElement} trigger - 触发元素
         */
        position(popover, trigger) {
            const triggerRect = trigger.getBoundingClientRect();
            const popoverRect = popover.getBoundingClientRect();
            const placement = popover.dataset.placement || 'bottom';
            
            let top, left;
            
            switch(placement) {
                case 'top':
                    top = triggerRect.top - popoverRect.height - 8;
                    left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
                    break;
                case 'bottom':
                    top = triggerRect.bottom + 8;
                    left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
                    break;
                case 'left':
                    top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
                    left = triggerRect.left - popoverRect.width - 8;
                    break;
                case 'right':
                    top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
                    left = triggerRect.right + 8;
                    break;
            }
            
            // 边界检查
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            if (left < 8) left = 8;
            if (left + popoverRect.width > viewportWidth - 8) {
                left = viewportWidth - popoverRect.width - 8;
            }
            if (top < 8) top = 8;
            if (top + popoverRect.height > viewportHeight - 8) {
                top = viewportHeight - popoverRect.height - 8;
            }
            
            popover.style.position = 'fixed';
            popover.style.top = top + 'px';
            popover.style.left = left + 'px';
            popover.style.zIndex = '9999';
        }
    };

    // ==================== Tabs 标签页组件 ====================
    
    const Tabs = {
        /**
         * 存储标签页状态
         */
        states: {},
        
        /**
         * 初始化标签页
         */
        init() {
            document.querySelectorAll('.t-tabs').forEach(tabs => {
                const tabsId = tabs.id;
                if (!tabsId) return;
                
                // 初始化状态
                const activeTab = tabs.querySelector('.t-tabs__item.is-active');
                this.states[tabsId] = {
                    activeName: activeTab?.dataset.name || ''
                };
                
                // 绑定点击事件
                tabs.querySelectorAll('.t-tabs__item').forEach(tab => {
                    tab.addEventListener('click', () => {
                        const tabName = tab.dataset.name;
                        if (tabName) {
                            this.switchTab(tabsId, tabName);
                        }
                    });
                });
            });
        },
        
        /**
         * 切换标签页
         * @param {string} tabsId - 标签页容器ID
         * @param {string} tabName - 标签页名称
         */
        switchTab(tabsId, tabName) {
            const tabs = document.getElementById(tabsId);
            const state = this.states[tabsId];
            if (!tabs || !state) return;
            
            // 更新状态
            state.activeName = tabName;
            
            // 更新标签样式
            tabs.querySelectorAll('.t-tabs__item').forEach(tab => {
                tab.classList.toggle('is-active', tab.dataset.name === tabName);
            });
            
            // 更新内容显示
            tabs.querySelectorAll('.t-tabs__pane').forEach(pane => {
                pane.classList.toggle('is-active', pane.dataset.name === tabName);
            });
            
            // 触发事件
            tabs.dispatchEvent(new CustomEvent('t:tabs:change', {
                detail: { name: tabName }
            }));
        },
        
        /**
         * 获取当前激活的标签页
         * @param {string} tabsId - 标签页容器ID
         * @returns {string} 当前激活的标签页名称
         */
        getActiveTab(tabsId) {
            const state = this.states[tabsId];
            return state ? state.activeName : '';
        },
        
        /**
         * 添加标签页
         * @param {string} tabsId - 标签页容器ID
         * @param {Object} tab - 标签页数据
         */
        addTab(tabsId, tab) {
            const tabs = document.getElementById(tabsId);
            if (!tabs) return;
            
            const header = tabs.querySelector('.t-tabs__header');
            const content = tabs.querySelector('.t-tabs__content');
            
            if (header && content) {
                // 添加标签
                const tabEl = document.createElement('div');
                tabEl.className = 't-tabs__item';
                tabEl.dataset.name = tab.name;
                tabEl.textContent = tab.label;
                tabEl.addEventListener('click', () => {
                    this.switchTab(tabsId, tab.name);
                });
                header.appendChild(tabEl);
                
                // 添加内容
                const paneEl = document.createElement('div');
                paneEl.className = 't-tabs__pane';
                paneEl.dataset.name = tab.name;
                paneEl.innerHTML = tab.content;
                content.appendChild(paneEl);
            }
        },
        
        /**
         * 移除标签页
         * @param {string} tabsId - 标签页容器ID
         * @param {string} tabName - 标签页名称
         */
        removeTab(tabsId, tabName) {
            const tabs = document.getElementById(tabsId);
            const state = this.states[tabsId];
            if (!tabs || !state) return;
            
            // 移除标签
            const tab = tabs.querySelector(`.t-tabs__item[data-name="${tabName}"]`);
            if (tab) {
                tab.remove();
            }
            
            // 移除内容
            const pane = tabs.querySelector(`.t-tabs__pane[data-name="${tabName}"]`);
            if (pane) {
                pane.remove();
            }
            
            // 如果移除的是当前激活的标签，切换到第一个
            if (state.activeName === tabName) {
                const firstTab = tabs.querySelector('.t-tabs__item');
                if (firstTab) {
                    this.switchTab(tabsId, firstTab.dataset.name);
                }
            }
        }
    };

    // ==================== Image 图片预览组件 ====================
    
    const Image = {
        /**
         * 当前预览的图片索引
         */
        currentIndex: 0,
        
        /**
         * 预览图片列表
         */
        previewList: [],
        
        /**
         * 初始化图片组件
         */
        init() {
            // 监听图片点击
            document.addEventListener('click', (e) => {
                const img = e.target.closest('.t-image__img');
                if (img && img.closest('.t-image')?.classList.contains('is-preview')) {
                    const previewSrc = img.dataset.preview || img.src;
                    this.preview(previewSrc);
                }
            });
            
            // 键盘导航
            document.addEventListener('keydown', (e) => {
                if (!this.isPreviewOpen()) return;
                
                switch(e.key) {
                    case 'Escape':
                        this.closePreview();
                        break;
                    case 'ArrowLeft':
                        this.prevImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                }
            });
        },
        
        /**
         * 预览图片
         * @param {string} src - 图片地址
         * @param {Array} [previewList] - 预览列表
         */
        preview(src, previewList) {
            if (previewList) {
                this.previewList = previewList;
                this.currentIndex = previewList.indexOf(src);
            } else {
                this.previewList = [src];
                this.currentIndex = 0;
            }
            
            this.showPreviewModal();
        },
        
        /**
         * 显示预览模态框
         */
        showPreviewModal() {
            // 创建或获取预览容器
            let previewContainer = document.getElementById('t-image-preview');
            
            if (!previewContainer) {
                previewContainer = document.createElement('div');
                previewContainer.id = 't-image-preview';
                previewContainer.className = 't-image-preview';
                previewContainer.innerHTML = `
                    <div class="t-image-preview__mask"></div>
                    <div class="t-image-preview__content">
                        <img class="t-image-preview__img" src="" alt="">
                        <div class="t-image-preview__actions">
                            <button class="t-image-preview__btn" onclick="TbeUI.Image.prevImage()">
                                <i class="t-icon-arrow-left"></i>
                            </button>
                            <button class="t-image-preview__btn" onclick="TbeUI.Image.nextImage()">
                                <i class="t-icon-arrow-right"></i>
                            </button>
                            <button class="t-image-preview__btn" onclick="TbeUI.Image.closePreview()">
                                <i class="t-icon-close"></i>
                            </button>
                        </div>
                        <div class="t-image-preview__counter">
                            <span class="t-image-preview__current">1</span> / <span class="t-image-preview__total">1</span>
                        </div>
                    </div>
                `;
                
                // 点击遮罩关闭
                previewContainer.querySelector('.t-image-preview__mask').addEventListener('click', () => {
                    this.closePreview();
                });
                
                document.body.appendChild(previewContainer);
            }
            
            previewContainer.classList.add('is-visible');
            this.updatePreviewImage();
        },
        
        /**
         * 更新预览图片
         */
        updatePreviewImage() {
            const previewContainer = document.getElementById('t-image-preview');
            if (!previewContainer) return;
            
            const img = previewContainer.querySelector('.t-image-preview__img');
            const currentEl = previewContainer.querySelector('.t-image-preview__current');
            const totalEl = previewContainer.querySelector('.t-image-preview__total');
            
            if (img) {
                img.src = this.previewList[this.currentIndex];
            }
            
            if (currentEl) {
                currentEl.textContent = this.currentIndex + 1;
            }
            
            if (totalEl) {
                totalEl.textContent = this.previewList.length;
            }
        },
        
        /**
         * 关闭预览
         */
        closePreview() {
            const previewContainer = document.getElementById('t-image-preview');
            if (previewContainer) {
                previewContainer.classList.remove('is-visible');
            }
        },
        
        /**
         * 检查预览是否打开
         * @returns {boolean} 是否打开
         */
        isPreviewOpen() {
            const previewContainer = document.getElementById('t-image-preview');
            return previewContainer?.classList.contains('is-visible');
        },
        
        /**
         * 上一张图片
         */
        prevImage() {
            if (this.previewList.length <= 1) return;
            
            this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = this.previewList.length - 1;
            }
            
            this.updatePreviewImage();
        },
        
        /**
         * 下一张图片
         */
        nextImage() {
            if (this.previewList.length <= 1) return;
            
            this.currentIndex++;
            if (this.currentIndex >= this.previewList.length) {
                this.currentIndex = 0;
            }
            
            this.updatePreviewImage();
        }
    };

    // ==================== Avatar 头像组件 ====================
    
    const Avatar = {
        /**
         * 处理头像图片加载失败
         * @param {HTMLImageElement} img - 图片元素
         * @param {string} fallbackText - 备用文字（可选）
         */
        handleError(img, fallbackText) {
            if (!img) return;
            
            const avatar = img.closest('.t-avatar');
            if (!avatar) return;
            
            // 移除失败的图片
            img.remove();
            
            if (fallbackText) {
                // 使用文字作为 fallback
                const textSpan = document.createElement('span');
                textSpan.className = 't-avatar__text';
                textSpan.textContent = fallbackText;
                avatar.appendChild(textSpan);
            } else {
                // 使用默认图标作为 fallback
                const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                iconSvg.setAttribute('class', 't-avatar__icon');
                iconSvg.setAttribute('viewBox', '0 0 24 24');
                iconSvg.setAttribute('fill', 'none');
                iconSvg.setAttribute('stroke', 'currentColor');
                iconSvg.setAttribute('stroke-width', '2');
                iconSvg.setAttribute('stroke-linecap', 'round');
                iconSvg.setAttribute('stroke-linejoin', 'round');
                
                const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path1.setAttribute('d', 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2');
                
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', '12');
                circle.setAttribute('cy', '7');
                circle.setAttribute('r', '4');
                
                iconSvg.appendChild(path1);
                iconSvg.appendChild(circle);
                avatar.appendChild(iconSvg);
            }
        }
    };

    // ==================== Tag 标签组件 ====================
    
    const Tag = {
        /**
         * 移除标签
         * @param {HTMLElement} closeBtn - 关闭按钮元素
         */
        remove(closeBtn) {
            if (!closeBtn) return;
            
            const tag = closeBtn.closest('.t-tag');
            if (!tag) return;
            
            // 添加离开动画
            tag.classList.add('t-tag-leave');
            
            // 动画结束后移除元素
            setTimeout(() => {
                if (tag.parentNode) {
                    tag.parentNode.removeChild(tag);
                }
            }, 300);
            
            // 触发事件
            const tagGroup = tag.closest('.t-tag-group');
            if (tagGroup) {
                tagGroup.dispatchEvent(new CustomEvent('t:tag:close', {
                    detail: { tag: tag }
                }));
            }
        },
        
        /**
         * 移除动态标签（用于动态编辑标签组）
         * @param {HTMLElement} closeBtn - 关闭按钮元素
         */
        removeDynamic(closeBtn) {
            this.remove(closeBtn);
        },
        
        /**
         * 显示标签输入框
         * @param {string} groupId - 标签组ID（可选）
         */
        showInput(groupId) {
            const group = groupId ? document.getElementById(groupId) : document.querySelector('.t-tag-group');
            if (!group) return;
            
            const addBtn = group.querySelector('.t-tag--editable');
            const tagInput = group.querySelector('.t-tag-input');
            const inputField = group.querySelector('.t-tag-input input');
            
            if (addBtn) {
                addBtn.style.display = 'none';
            }
            
            if (tagInput) {
                tagInput.style.display = 'inline-flex';
            }
            
            if (inputField) {
                inputField.focus();
            }
        },
        
        /**
         * 隐藏标签输入框
         * @param {string} groupId - 标签组ID（可选）
         */
        hideInput(groupId) {
            const group = groupId ? document.getElementById(groupId) : document.querySelector('.t-tag-group');
            if (!group) return;
            
            const addBtn = group.querySelector('.t-tag--editable');
            const tagInput = group.querySelector('.t-tag-input');
            const inputField = group.querySelector('.t-tag-input input');
            
            // 延迟隐藏，以便点击事件能正常触发
            setTimeout(() => {
                if (addBtn) {
                    addBtn.style.display = 'inline-flex';
                }
                
                if (tagInput) {
                    tagInput.style.display = 'none';
                }
                
                if (inputField) {
                    inputField.value = '';
                }
            }, 200);
        },
        
        /**
         * 处理标签输入
         * @param {Event} event - 键盘事件
         * @param {string} groupId - 标签组ID（可选）
         */
        handleInput(event, groupId) {
            const group = groupId ? document.getElementById(groupId) : document.querySelector('.t-tag-group');
            if (!group) return;
            
            if (event.key === 'Enter') {
                const input = event.target;
                const text = input.value.trim();
                
                if (text) {
                    this.add(text, group);
                }
                
                input.value = '';
                this.hideInput(groupId);
            } else if (event.key === 'Escape') {
                this.hideInput(groupId);
            }
        },
        
        /**
         * 添加新标签
         * @param {string} text - 标签文本
         * @param {HTMLElement} group - 标签组元素
         */
        add(text, group) {
            if (!group) return;

            const newTag = document.createElement('span');
            newTag.className = 't-tag t-tag-enter';
            newTag.innerHTML = text + '<i class="t-tag__close" onclick="removeDynamicTag(this)">×</i>';
            
            // 插入到添加按钮之前
            const addBtn = group.querySelector('.t-tag--editable');
            if (addBtn) {
                group.insertBefore(newTag, addBtn);
            } else {
                group.appendChild(newTag);
            }
            
            // 移除进入动画类
            setTimeout(() => {
                newTag.classList.remove('t-tag-enter');
            }, 300);
            
            // 触发事件
            group.dispatchEvent(new CustomEvent('t:tag:add', {
                detail: { text: text, tag: newTag }
            }));
        }
    };

    // ==================== Carousel 走马灯组件 ====================
    
    const Carousel = {
        /**
         * 存储走马灯状态
         */
        states: {},
        
        /**
         * 初始化走马灯
         */
        init() {
            document.querySelectorAll('.t-carousel').forEach(carousel => {
                const carouselId = carousel.id;
                if (!carouselId) return;
                
                // 解析配置
                const autoplay = carousel.dataset.autoplay === 'true';
                const interval = parseInt(carousel.dataset.interval) || 3000;
                const loop = carousel.dataset.loop !== 'false';
                
                // 初始化状态
                this.states[carouselId] = {
                    currentIndex: 0,
                    itemCount: carousel.querySelectorAll('.t-carousel__item').length,
                    autoplay: autoplay,
                    interval: interval,
                    loop: loop,
                    timer: null
                };
                
                // 绑定事件
                this.bindEvents(carouselId);
                
                // 自动播放
                if (autoplay) {
                    this.startAutoplay(carouselId);
                }
                
                // 更新指示器
                this.updateIndicators(carouselId);
            });
        },
        
        /**
         * 绑定事件
         * @param {string} carouselId - 走马灯ID
         */
        bindEvents(carouselId) {
            const carousel = document.getElementById(carouselId);
            if (!carousel) return;
            
            const state = this.states[carouselId];
            
            // 上一张
            const prevBtn = carousel.querySelector('.t-carousel__arrow--left');
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    this.prev(carouselId);
                    this.resetAutoplay(carouselId);
                });
            }
            
            // 下一张
            const nextBtn = carousel.querySelector('.t-carousel__arrow--right');
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    this.next(carouselId);
                    this.resetAutoplay(carouselId);
                });
            }
            
            // 指示器点击
            carousel.querySelectorAll('.t-carousel__indicator').forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    this.goTo(carouselId, index);
                    this.resetAutoplay(carouselId);
                });
            });
            
            // 鼠标悬停暂停
            carousel.addEventListener('mouseenter', () => {
                this.stopAutoplay(carouselId);
            });
            
            carousel.addEventListener('mouseleave', () => {
                if (state.autoplay) {
                    this.startAutoplay(carouselId);
                }
            });
        },
        
        /**
         * 切换到指定索引
         * @param {string} carouselId - 走马灯ID
         * @param {number} index - 目标索引
         */
        goTo(carouselId, index) {
            const carousel = document.getElementById(carouselId);
            const state = this.states[carouselId];
            if (!carousel || !state) return;
            
            // 边界检查
            if (index < 0) {
                index = state.loop ? state.itemCount - 1 : 0;
            } else if (index >= state.itemCount) {
                index = state.loop ? 0 : state.itemCount - 1;
            }
            
            state.currentIndex = index;
            
            // 更新位置
            const track = carousel.querySelector('.t-carousel__track');
            if (track) {
                track.style.transform = 'translateX(-' + (index * 100) + '%)';
            }
            
            // 更新指示器
            this.updateIndicators(carouselId);
            
            // 触发事件
            carousel.dispatchEvent(new CustomEvent('t:carousel:change', {
                detail: { index: index }
            }));
        },
        
        /**
         * 下一张
         * @param {string} carouselId - 走马灯ID
         */
        next(carouselId) {
            const state = this.states[carouselId];
            if (!state) return;
            
            this.goTo(carouselId, state.currentIndex + 1);
        },
        
        /**
         * 上一张
         * @param {string} carouselId - 走马灯ID
         */
        prev(carouselId) {
            const state = this.states[carouselId];
            if (!state) return;
            
            this.goTo(carouselId, state.currentIndex - 1);
        },
        
        /**
         * 更新指示器
         * @param {string} carouselId - 走马灯ID
         */
        updateIndicators(carouselId) {
            const carousel = document.getElementById(carouselId);
            const state = this.states[carouselId];
            if (!carousel || !state) return;
            
            carousel.querySelectorAll('.t-carousel__indicator').forEach((indicator, index) => {
                indicator.classList.toggle('is-active', index === state.currentIndex);
            });
        },
        
        /**
         * 开始自动播放
         * @param {string} carouselId - 走马灯ID
         */
        startAutoplay(carouselId) {
            const state = this.states[carouselId];
            if (!state || !state.autoplay) return;
            
            this.stopAutoplay(carouselId);
            
            state.timer = setInterval(() => {
                this.next(carouselId);
            }, state.interval);
        },
        
        /**
         * 停止自动播放
         * @param {string} carouselId - 走马灯ID
         */
        stopAutoplay(carouselId) {
            const state = this.states[carouselId];
            if (!state || !state.timer) return;
            
            clearInterval(state.timer);
            state.timer = null;
        },
        
        /**
         * 重置自动播放
         * @param {string} carouselId - 走马灯ID
         */
        resetAutoplay(carouselId) {
            const state = this.states[carouselId];
            if (!state || !state.autoplay) return;
            
            this.stopAutoplay(carouselId);
            this.startAutoplay(carouselId);
        },
        
        /**
         * 设置自动播放
         * @param {string} carouselId - 走马灯ID
         * @param {boolean} autoplay - 是否自动播放
         */
        setAutoplay(carouselId, autoplay) {
            const state = this.states[carouselId];
            if (!state) return;
            
            state.autoplay = autoplay;
            
            if (autoplay) {
                this.startAutoplay(carouselId);
            } else {
                this.stopAutoplay(carouselId);
            }
        }
    };

    // ==================== Tree 树形控件组件 ====================
    
    const Tree = {
        /**
         * 树形控件状态管理
         */
        states: {},
        
        /**
         * 拖拽状态
         */
        dragNode: null,
        dragTreeId: null,
        dragNodeEl: null,
        
        /**
         * 树形数据
         */
        treeData: {
            basic: [
                { id: 1, label: '一级 1', children: [
                    { id: 4, label: '二级 1-1', children: [
                        { id: 9, label: '三级 1-1-1' },
                        { id: 10, label: '三级 1-1-2' }
                    ]}
                ]},
                { id: 2, label: '一级 2', children: [
                    { id: 5, label: '二级 2-1' },
                    { id: 6, label: '二级 2-2' }
                ]},
                { id: 3, label: '一级 3', children: [
                    { id: 7, label: '二级 3-1' },
                    { id: 8, label: '二级 3-2' }
                ]}
            ],
            selectable: [
                { id: 1, label: '一级 1', children: [
                    { id: 4, label: '二级 1-1', children: [
                        { id: 9, label: '三级 1-1-1' },
                        { id: 10, label: '三级 1-1-2' }
                    ]}
                ]},
                { id: 2, label: '一级 2', children: [
                    { id: 5, label: '二级 2-1' },
                    { id: 6, label: '二级 2-2' }
                ]},
                { id: 3, label: '一级 3', children: [
                    { id: 7, label: '二级 3-1' },
                    { id: 8, label: '二级 3-2', disabled: true }
                ]}
            ],
            lazy: [
                { id: 1, label: 'region1', isLeaf: false },
                { id: 2, label: 'region2', isLeaf: false }
            ],
            defaultExpanded: [
                { id: 1, label: '一级 1', expanded: true, children: [
                    { id: 4, label: '二级 1-1', expanded: true, children: [
                        { id: 9, label: '三级 1-1-1' },
                        { id: 10, label: '三级 1-1-2' }
                    ]}
                ]},
                { id: 2, label: '一级 2', children: [
                    { id: 5, label: '二级 2-1' },
                    { id: 6, label: '二级 2-2' }
                ]},
                { id: 3, label: '一级 3', children: [
                    { id: 7, label: '二级 3-1' },
                    { id: 8, label: '二级 3-2' }
                ]}
            ],
            disabled: [
                { id: 1, label: '一级 1', children: [
                    { id: 4, label: '二级 1-1', children: [
                        { id: 9, label: '三级 1-1-1' },
                        { id: 10, label: '三级 1-1-2' }
                    ]}
                ]},
                { id: 2, label: '一级 2', disabled: true, children: [
                    { id: 5, label: '二级 2-1' },
                    { id: 6, label: '二级 2-2' }
                ]},
                { id: 3, label: '一级 3', children: [
                    { id: 7, label: '二级 3-1', disabled: true },
                    { id: 8, label: '二级 3-2' }
                ]}
            ],
            custom: [
                { id: 1, label: '一级 1', children: [
                    { id: 4, label: '二级 1-1', children: [
                        { id: 9, label: '三级 1-1-1' },
                        { id: 10, label: '三级 1-1-2' }
                    ]}
                ]},
                { id: 2, label: '一级 2', children: [
                    { id: 5, label: '二级 2-1' },
                    { id: 6, label: '二级 2-2' }
                ]},
                { id: 3, label: '一级 3', children: [
                    { id: 7, label: '二级 3-1' },
                    { id: 8, label: '二级 3-2' }
                ]}
            ],
            filter: [
                { id: 1, label: '一级 1', children: [
                    { id: 4, label: '二级 1-1', children: [
                        { id: 9, label: '三级 1-1-1' },
                        { id: 10, label: '三级 1-1-2' }
                    ]}
                ]},
                { id: 2, label: '一级 2', children: [
                    { id: 5, label: '二级 2-1' },
                    { id: 6, label: '二级 2-2' }
                ]},
                { id: 3, label: '一级 3', children: [
                    { id: 7, label: '二级 3-1' },
                    { id: 8, label: '二级 3-2' }
                ]}
            ],
            accordion: [
                { id: 1, label: '一级 1', children: [
                    { id: 4, label: '二级 1-1' },
                    { id: 5, label: '二级 1-2' }
                ]},
                { id: 2, label: '一级 2', children: [
                    { id: 6, label: '二级 2-1' },
                    { id: 7, label: '二级 2-2' }
                ]},
                { id: 3, label: '一级 3', children: [
                    { id: 8, label: '二级 3-1' },
                    { id: 9, label: '二级 3-2' }
                ]}
            ],
            draggable: [
                { id: 1, label: '一级 1', children: [
                    { id: 4, label: '二级 1-1', children: [
                        { id: 9, label: '三级 1-1-1' },
                        { id: 10, label: '三级 1-1-2' }
                    ]}
                ]},
                { id: 2, label: '一级 2', children: [
                    { id: 5, label: '二级 2-1' },
                    { id: 6, label: '二级 2-2' }
                ]},
                { id: 3, label: '一级 3', children: [
                    { id: 7, label: '二级 3-1' },
                    { id: 8, label: '二级 3-2' }
                ]}
            ]
        },
        
        /**
         * 初始化所有树形控件
         */
        init() {
            this.renderTree('tree-basic', this.treeData.basic, { showCheckbox: false });
            this.renderTree('tree-selectable', this.treeData.selectable, { showCheckbox: true });
            this.renderTree('tree-lazy', this.treeData.lazy, { lazy: true, load: this.loadNode });
            this.renderTree('tree-default-expanded', this.treeData.defaultExpanded, {
                showCheckbox: false,
                highlightCurrent: true,
                defaultExpandedKeys: [1, 4]
            });
            this.renderTree('tree-disabled', this.treeData.disabled, { showCheckbox: true });
            this.renderTree('tree-node-select', this.treeData.basic, {
                showCheckbox: false,
                highlightCurrent: true
            });
            this.renderTree('tree-custom', this.treeData.custom, {
                showCheckbox: false,
                renderContent: this.renderCustomContent
            });
            this.renderTree('tree-filter', this.treeData.filter, { showCheckbox: false });
            this.renderTree('tree-accordion', this.treeData.accordion, { showCheckbox: false, accordion: true });
            this.renderTree('tree-draggable', this.treeData.draggable, { showCheckbox: false, draggable: true });
        },
        
        /**
         * 渲染树形控件
         */
        renderTree(treeId, data, options = {}) {
            const container = document.getElementById(treeId);
            if (!container) return;

            // 保留已有的状态（选中、展开等）
            const existingState = this.states[treeId];
            const checkedKeys = existingState ? existingState.checkedKeys : new Set();
            const expandedKeys = existingState ? existingState.expandedKeys : new Set(options.defaultExpandedKeys || []);
            const currentKey = existingState ? existingState.currentKey : null;

            this.states[treeId] = {
                data: JSON.parse(JSON.stringify(data)),
                options: options,
                expandedKeys: expandedKeys,
                checkedKeys: checkedKeys,
                currentKey: currentKey
            };

            container.innerHTML = '';
            const treeContent = document.createElement('div');
            treeContent.className = 't-tree-content';

            this.states[treeId].data.forEach(node => {
                treeContent.appendChild(this.createTreeNode(treeId, node, 0));
            });

            container.appendChild(treeContent);
        },
        
        /**
         * 创建树节点
         */
        createTreeNode(treeId, node, level, parentNode = null) {
            const state = this.states[treeId];
            const options = state.options;
            const nodeEl = document.createElement('div');
            nodeEl.className = 't-tree-node';
            nodeEl.dataset.nodeId = node.id;

            if (node.disabled) {
                nodeEl.classList.add('is-disabled');
            }

            const contentEl = document.createElement('div');
            contentEl.className = 't-tree-node__content';
            if (state.currentKey === node.id) {
                contentEl.classList.add('is-current');
            }

            // 缩进
            for (let i = 0; i < level; i++) {
                const indent = document.createElement('span');
                indent.className = 't-tree-node__indent';
                contentEl.appendChild(indent);
            }

            // 展开/折叠图标 - 修正 1：只有当节点有子节点或开启懒加载时才显示箭头
            const expandIcon = document.createElement('span');
            expandIcon.className = 't-tree-node__expand-icon';
            
            // 判断是否为叶子节点：没有子节点且不是懒加载，或者明确标记为叶子节点
            const hasChildren = node.children && node.children.length > 0;
            const isLeafNode = (!hasChildren && !options.lazy) || node.isLeaf === true;
            
            if (isLeafNode) {
                // 叶子节点，不显示箭头
                expandIcon.classList.add('is-leaf');
            } else {
                // 非叶子节点，显示箭头
                expandIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>';
                if (state.expandedKeys.has(node.id) || node.expanded) {
                    expandIcon.classList.add('expanded');
                }
                if (!node.disabled) {
                    expandIcon.onclick = (e) => {
                        e.stopPropagation();
                        this.toggleNode(treeId, node, nodeEl);
                    };
                } else {
                    expandIcon.classList.add('is-disabled');
                    expandIcon.style.cursor = 'not-allowed';
                    expandIcon.style.opacity = '0.5';
                }
            }
            contentEl.appendChild(expandIcon);

            // 复选框 - 修正 2：完善复选框逻辑
            if (options.showCheckbox) {
                const checkbox = document.createElement('span');
                checkbox.className = 't-tree-node__checkbox';
                if (node.disabled) {
                    checkbox.classList.add('is-disabled');
                }
                const isChecked = state.checkedKeys.has(node.id);
                const isIndeterminateState = this.isIndeterminate(treeId, node);
                if (isChecked) {
                    checkbox.classList.add('is-checked');
                } else if (isIndeterminateState) {
                    checkbox.classList.add('is-indeterminate');
                }
                checkbox.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!node.disabled) {
                        this.toggleCheckbox(treeId, node);
                    }
                };
                // 阻止复选框区域的事件冒泡到父元素
                checkbox.addEventListener('mousedown', (e) => {
                    e.stopPropagation();
                });
                contentEl.appendChild(checkbox);
            }

            // 节点标签或自定义内容
            if (options.renderContent) {
                contentEl.appendChild(options.renderContent(node));
            } else {
                const label = document.createElement('span');
                label.className = 't-tree-node__label';
                label.textContent = node.label;
                contentEl.appendChild(label);
            }

            // 节点点击事件 - 如果有子节点，点击整行也能展开/折叠
            contentEl.onclick = (e) => {
                if (!node.disabled) {
                    // 检查点击的是否是特殊元素（复选框、展开图标等）
                    const isSpecialElement = e.target.closest('.t-tree-node__checkbox') || 
                                           e.target.closest('.t-tree-node__expand-icon');
                    
                    // 如果不是特殊元素，且有子节点，则切换展开状态
                    if (!isSpecialElement && (hasChildren || (options.lazy && !node.isLeaf && !node.loaded))) {
                        this.toggleNode(treeId, node, nodeEl);
                    } else {
                        this.selectNode(treeId, node, contentEl);
                    }
                }
            };

            nodeEl.appendChild(contentEl);

            // 子节点容器
            if (hasChildren) {
                const childrenEl = document.createElement('div');
                childrenEl.className = 't-tree-node__children';
                if (!state.expandedKeys.has(node.id) && !node.expanded) {
                    childrenEl.classList.add('collapsed');
                    childrenEl.style.height = '0';
                } else {
                    childrenEl.style.height = 'auto';
                }

                node.children.forEach(child => {
                    childrenEl.appendChild(this.createTreeNode(treeId, child, level + 1, node));
                });

                nodeEl.appendChild(childrenEl);
            } else if (options.lazy && !node.isLeaf && !node.loaded) {
                // 懒加载占位
                const childrenEl = document.createElement('div');
                childrenEl.className = 't-tree-node__children collapsed';
                childrenEl.style.height = '0';
                nodeEl.appendChild(childrenEl);
            }

            // 拖拽功能 - 修正 5：添加拖拽支持
            if (options.draggable && !node.disabled) {
                contentEl.draggable = true;
                contentEl.ondragstart = (e) => this.handleDragStart(e, treeId, node, nodeEl);
                contentEl.ondragover = (e) => this.handleDragOver(e, treeId, node, nodeEl);
                contentEl.ondrop = (e) => this.handleDrop(e, treeId, node, nodeEl);
                contentEl.ondragend = (e) => this.handleDragEnd(e, treeId, nodeEl);
            }

            return nodeEl;
        },
        
        /**
         * 切换节点展开/折叠
         */
        toggleNode(treeId, node, nodeEl) {
            const state = this.states[treeId];
            const options = state.options;
            const expandIcon = nodeEl.querySelector('.t-tree-node__expand-icon');
            const childrenEl = nodeEl.querySelector('.t-tree-node__children');

            // 手风琴模式：关闭同级其他节点
            if (options.accordion && !state.expandedKeys.has(node.id)) {
                const parentEl = nodeEl.parentElement;
                if (parentEl) {
                    parentEl.querySelectorAll(':scope > .t-tree-node').forEach(sibling => {
                        if (sibling !== nodeEl) {
                            const siblingId = parseInt(sibling.dataset.nodeId);
                            if (state.expandedKeys.has(siblingId)) {
                                const siblingExpandIcon = sibling.querySelector('.t-tree-node__expand-icon');
                                const siblingChildren = sibling.querySelector('.t-tree-node__children');
                                if (siblingExpandIcon) siblingExpandIcon.classList.remove('expanded');
                                if (siblingChildren) {
                                    siblingChildren.style.height = siblingChildren.scrollHeight + 'px';
                                    setTimeout(() => {
                                        siblingChildren.style.height = '0';
                                    }, 10);
                                }
                                state.expandedKeys.delete(siblingId);
                            }
                        }
                    });
                }
            }

            // 修正 3：懒加载功能
            if (options.lazy && !node.loaded && !node.isLeaf && options.load) {
                // 显示加载状态
                const loadingEl = document.createElement('span');
                loadingEl.className = 't-tree-node__loading';
                loadingEl.textContent = '⏳';
                loadingEl.style.marginLeft = '4px';
                loadingEl.style.fontSize = '12px';
                expandIcon.parentNode.insertBefore(loadingEl, expandIcon.nextSibling);
                expandIcon.style.display = 'none';

                options.load(node, (children) => {
                    loadingEl.remove();
                    expandIcon.style.display = '';
                    node.loaded = true;
                    node.children = children;

                    if (children.length === 0) {
                        node.isLeaf = true;
                        expandIcon.classList.add('is-leaf');
                        expandIcon.innerHTML = '';
                        return;
                    }

                    // 将当前节点标记为展开状态
                    state.expandedKeys.add(node.id);

                    // 重新渲染树
                    this.renderTree(treeId, state.data, options);
                });
                return;
            }

            // 切换展开/折叠状态
            if (state.expandedKeys.has(node.id)) {
                state.expandedKeys.delete(node.id);
                expandIcon.classList.remove('expanded');
                if (childrenEl) {
                    childrenEl.style.height = childrenEl.scrollHeight + 'px';
                    setTimeout(() => {
                        childrenEl.style.height = '0';
                    }, 10);
                }
            } else {
                state.expandedKeys.add(node.id);
                expandIcon.classList.add('expanded');
                if (childrenEl) {
                    childrenEl.classList.remove('collapsed');
                    childrenEl.style.height = childrenEl.scrollHeight + 'px';
                    setTimeout(() => {
                        childrenEl.style.height = 'auto';
                    }, 300);
                }
            }
        },
        
        /**
         * 切换复选框 - 修正 2：完善复选框逻辑
         */
        toggleCheckbox(treeId, node) {
            const state = this.states[treeId];
            const isChecked = state.checkedKeys.has(node.id);

            if (isChecked) {
                state.checkedKeys.delete(node.id);
                this.uncheckChildren(treeId, node);
            } else {
                state.checkedKeys.add(node.id);
                this.checkChildren(treeId, node);
            }

            this.updateParentCheckbox(treeId, node);
            this.renderTree(treeId, state.data, state.options);
        },
        
        /**
         * 选中子节点
         */
        checkChildren(treeId, node) {
            const state = this.states[treeId];
            if (node.children) {
                node.children.forEach(child => {
                    if (!child.disabled) {
                        state.checkedKeys.add(child.id);
                        this.checkChildren(treeId, child);
                    }
                });
            }
        },
        
        /**
         * 取消选中子节点
         */
        uncheckChildren(treeId, node) {
            const state = this.states[treeId];
            if (node.children) {
                node.children.forEach(child => {
                    state.checkedKeys.delete(child.id);
                    this.uncheckChildren(treeId, child);
                });
            }
        },
        
        /**
         * 更新父节点复选框状态
         */
        updateParentCheckbox(treeId, node) {
            // 简化处理，实际应该递归更新父节点
        },
        
        /**
         * 判断是否半选状态
         */
        isIndeterminate(treeId, node) {
            const state = this.states[treeId];
            if (!node.children || node.children.length === 0) return false;

            let checkedCount = 0;
            let hasIndeterminate = false;

            node.children.forEach(child => {
                if (state.checkedKeys.has(child.id)) {
                    checkedCount++;
                } else if (this.isIndeterminate(treeId, child)) {
                    hasIndeterminate = true;
                }
            });

            return (checkedCount > 0 && checkedCount < node.children.length) || hasIndeterminate;
        },
        
        /**
         * 选择节点
         */
        selectNode(treeId, node, contentEl) {
            const state = this.states[treeId];
            state.currentKey = node.id;
            
            contentEl.parentElement.querySelectorAll('.t-tree-node__content').forEach(el => {
                el.classList.remove('is-current');
            });
            contentEl.classList.add('is-current');
        },
        
        /**
         * 懒加载函数
         */
        loadNode(node, resolve) {
            setTimeout(() => {
                resolve([
                    { id: node.id * 10 + 1, label: `子节点 ${node.id}-1` },
                    { id: node.id * 10 + 2, label: `子节点 ${node.id}-2` }
                ]);
            }, 500);
        },
        
        /**
         * 渲染自定义内容
         */
        renderCustomContent(node) {
            const div = document.createElement('div');
            div.className = 't-tree-node__custom-content';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.gap = '8px';
            div.innerHTML = `<span>📁</span><span>${node.label}</span>`;
            return div;
        },
        
        /**
         * 过滤树 - 修正 4：改进过滤逻辑，支持递归显示匹配的父节点和子节点
         */
        filterTree(keyword) {
            const tree = document.getElementById('tree-filter');
            if (!tree) return;
            
            const allNodes = tree.querySelectorAll('.t-tree-node');
            
            // 如果没有关键字，显示所有节点
            if (!keyword || keyword.trim() === '') {
                allNodes.forEach(node => {
                    node.style.display = '';
                    // 恢复子节点显示
                    const children = node.querySelector('.t-tree-node__children');
                    if (children) {
                        children.style.display = '';
                        children.classList.remove('collapsed');
                        children.style.height = 'auto';
                    }
                    // 恢复展开图标
                    const expandIcon = node.querySelector('.t-tree-node__expand-icon');
                    if (expandIcon && !expandIcon.classList.contains('is-leaf')) {
                        expandIcon.style.display = '';
                    }
                });
                return;
            }
            
            const lowerKeyword = keyword.toLowerCase();
            
            // 首先隐藏所有节点
            allNodes.forEach(node => {
                node.style.display = 'none';
            });
            
            // 找出所有匹配的节点
            const matchedNodes = new Set();
            
            allNodes.forEach(node => {
                const label = node.querySelector('.t-tree-node__label');
                if (label && label.textContent.toLowerCase().includes(lowerKeyword)) {
                    matchedNodes.add(node);
                    
                    // 显示该节点的所有父节点
                    let parent = node.parentElement;
                    while (parent && !parent.classList.contains('t-tree-content')) {
                        if (parent.classList.contains('t-tree-node')) {
                            matchedNodes.add(parent);
                            // 展开父节点
                            const children = parent.querySelector('.t-tree-node__children');
                            if (children) {
                                children.style.display = '';
                                children.classList.remove('collapsed');
                                children.style.height = 'auto';
                            }
                            // 展开图标
                            const expandIcon = parent.querySelector('.t-tree-node__expand-icon');
                            if (expandIcon && !expandIcon.classList.contains('is-leaf')) {
                                expandIcon.classList.add('expanded');
                            }
                        }
                        parent = parent.parentElement;
                    }
                    
                    // 显示该节点的所有子节点
                    this.showAllChildren(node);
                }
            });
            
            // 显示所有匹配的节点
            matchedNodes.forEach(node => {
                node.style.display = '';
            });
        },
        
        /**
         * 显示节点的所有子节点（递归）
         */
        showAllChildren(node) {
            const childrenContainer = node.querySelector('.t-tree-node__children');
            if (childrenContainer) {
                childrenContainer.style.display = '';
                childrenContainer.classList.remove('collapsed');
                childrenContainer.style.height = 'auto';
                
                // 展开图标
                const expandIcon = node.querySelector('.t-tree-node__expand-icon');
                if (expandIcon && !expandIcon.classList.contains('is-leaf')) {
                    expandIcon.classList.add('expanded');
                }
                
                // 递归显示子节点
                const childNodes = childrenContainer.querySelectorAll(':scope > .t-tree-node');
                childNodes.forEach(childNode => {
                    childNode.style.display = '';
                    this.showAllChildren(childNode);
                });
            }
        },
        
        /**
         * 拖拽开始 - 修正 5：实现拖拽功能
         */
        handleDragStart(e, treeId, node, nodeEl) {
            this.dragNode = node;
            this.dragTreeId = treeId;
            this.dragNodeEl = nodeEl;
            
            e.dataTransfer.setData('text/plain', JSON.stringify({
                nodeId: node.id,
                nodeLabel: node.label
            }));
            e.dataTransfer.effectAllowed = 'move';
            
            // 添加拖拽样式
            setTimeout(() => {
                nodeEl.classList.add('is-dragging');
            }, 0);
        },
        
        /**
         * 拖拽经过
         */
        handleDragOver(e, treeId, node, nodeEl) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            // 检查是否同一棵树
            if (this.dragTreeId !== treeId) return;
            
            // 检查是否拖拽到自身或子节点
            if (this.isDescendant(nodeEl, this.dragNodeEl) || this.dragNode.id === node.id) {
                return;
            }
            
            const rect = e.target.closest('.t-tree-node__content').getBoundingClientRect();
            const offset = e.clientY - rect.top;
            const height = rect.height;
            
            nodeEl.classList.remove('is-drop-before', 'is-drop-after', 'is-drop-inner');
            
            if (offset < height * 0.25) {
                nodeEl.classList.add('is-drop-before');
            } else if (offset > height * 0.75) {
                nodeEl.classList.add('is-drop-after');
            } else {
                nodeEl.classList.add('is-drop-inner');
            }
        },
        
        /**
         * 拖拽放下
         */
        handleDrop(e, treeId, targetNode, targetNodeEl) {
            e.preventDefault();
            
            // 检查是否同一棵树
            if (this.dragTreeId !== treeId || this.dragNode.id === targetNode.id) {
                this.handleDragEnd(e, treeId, targetNodeEl);
                return;
            }
            
            // 检查是否拖拽到自身或子节点
            if (this.isDescendant(targetNodeEl, this.dragNodeEl)) {
                // console.log('不能将节点移动到自身或其子节点中');
                this.handleDragEnd(e, treeId, targetNodeEl);
                return;
            }
            
            const rect = e.target.closest('.t-tree-node__content').getBoundingClientRect();
            const offset = e.clientY - rect.top;
            const height = rect.height;
            
            let dropType = 'inner';
            if (offset < height * 0.25) {
                dropType = 'before';
            } else if (offset > height * 0.75) {
                dropType = 'after';
            }
            
            // 执行实际的节点移动
            this.moveNode(treeId, this.dragNode, targetNode, dropType);
            
            // console.log(`将 ${this.dragNode.label} 移动到 ${targetNode.label} ${dropType === 'inner' ? '内部' : (dropType === 'before' ? '之前' : '之后')}`);
            
            this.handleDragEnd(e, treeId, targetNodeEl);
        },
        
        /**
         * 拖拽结束
         */
        handleDragEnd(e, treeId, nodeEl) {
            const state = this.states[this.dragTreeId];
            if (state) {
                const treeEl = document.getElementById(this.dragTreeId);
                if (treeEl) {
                    treeEl.querySelectorAll('.t-tree-node').forEach(el => {
                        el.classList.remove('is-dragging', 'is-drop-before', 'is-drop-after', 'is-drop-inner');
                    });
                }
            }
            
            // 移除所有拖拽样式
            document.querySelectorAll('.t-tree-node__content.is-drag-over').forEach(el => {
                el.classList.remove('is-drag-over');
            });
            
            // 清空拖拽状态
            this.dragNode = null;
            this.dragTreeId = null;
            this.dragNodeEl = null;
        },
        
        /**
         * 检查 target 是否是 source 的后代节点
         */
        isDescendant(source, target) {
            let parent = target.parentElement;
            while (parent) {
                if (parent === source) return true;
                parent = parent.parentElement;
            }
            return false;
        },
        
        /**
         * 移动节点
         */
        moveNode(treeId, sourceNode, targetNode, dropType) {
            const state = this.states[treeId];
            const data = state.data;
            
            // 从原位置移除节点
            this.removeNodeFromTree(data, sourceNode.id);
            
            // 根据放置类型插入到新位置
            if (dropType === 'inner') {
                // 作为子节点插入
                const targetNodeInData = this.findNodeInTree(data, targetNode.id);
                if (targetNodeInData) {
                    if (!targetNodeInData.children) {
                        targetNodeInData.children = [];
                    }
                    targetNodeInData.children.push(JSON.parse(JSON.stringify(sourceNode)));
                    // 展开目标节点
                    state.expandedKeys.add(targetNode.id);
                }
            } else {
                // 作为兄弟节点插入（before 或 after）
                const result = this.findNodeAndParent(data, targetNode.id);
                if (result) {
                    const { parent, index } = result;
                    const insertIndex = dropType === 'before' ? index : index + 1;
                    parent.splice(insertIndex, 0, JSON.parse(JSON.stringify(sourceNode)));
                }
            }
            
            // 重新渲染树
            this.renderTree(treeId, data, state.options);
        },
        
        /**
         * 从树中移除节点
         */
        removeNodeFromTree(data, nodeId) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === nodeId) {
                    data.splice(i, 1);
                    return true;
                }
                if (data[i].children) {
                    const removed = this.removeNodeFromTree(data[i].children, nodeId);
                    if (removed) return true;
                }
            }
            return false;
        },
        
        /**
         * 在树中查找节点
         */
        findNodeInTree(data, nodeId) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === nodeId) {
                    return data[i];
                }
                if (data[i].children) {
                    const found = this.findNodeInTree(data[i].children, nodeId);
                    if (found) return found;
                }
            }
            return null;
        },
        
        /**
         * 查找节点及其父节点数组
         */
        findNodeAndParent(data, nodeId, parent = null) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === nodeId) {
                    return { parent: parent || data, index: i };
                }
                if (data[i].children) {
                    const result = this.findNodeAndParent(data[i].children, nodeId, data[i].children);
                    if (result) return result;
                }
            }
            return null;
        },
    };

    // ==================== InfiniteScroll 无限滚动组件 ====================

    const InfiniteScroll = {
        /**
         * 存储所有无限滚动实例
         */
        instances: {},

        /**
         * 初始化无限滚动
         */
        init() {
            document.querySelectorAll('.t-infinite-scroll-demo').forEach(container => {
                const id = container.id;
                if (!id) return;

                const list = container.querySelector('.t-infinite-scroll__content');
                const loading = container.querySelector('.t-infinite-scroll__loading');
                const finished = container.querySelector('.t-infinite-scroll__finished');

                if (!list || !loading || !finished) return;

                this.instances[id] = {
                    container,
                    list,
                    loading,
                    finished,
                    itemCount: list.querySelectorAll('.t-infinite-scroll__item').length,
                    isLoading: false,
                    isFinished: false,
                    maxItems: container.dataset.maxItems ? parseInt(container.dataset.maxItems) : 20,
                    loadOnce: container.dataset.loadOnce ? parseInt(container.dataset.loadOnce) : 3
                };

                container.addEventListener('scroll', () => {
                    this.handleScroll(id);
                });
            });
        },

        /**
         * 处理滚动事件
         */
        handleScroll(id) {
            const instance = this.instances[id];
            if (!instance || instance.isLoading || instance.isFinished) return;

            const { container, list, loading, finished, maxItems, loadOnce } = instance;
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;

            if (scrollTop + clientHeight >= scrollHeight - 50) {
                this.loadMore(id);
            }
        },

        /**
         * 加载更多数据
         */
        loadMore(id) {
            const instance = this.instances[id];
            if (!instance || instance.isLoading || instance.isFinished) return;

            instance.isLoading = true;
            instance.loading.style.display = 'flex';

            setTimeout(() => {
                const { list, loading, finished, maxItems, loadOnce, container } = instance;

                if (instance.itemCount >= maxItems) {
                    instance.isFinished = true;
                    instance.loading.style.display = 'none';
                    finished.style.display = 'flex';
                } else {
                    for (let i = 0; i < loadOnce; i++) {
                        if (instance.itemCount >= maxItems) break;

                        instance.itemCount++;
                        const item = document.createElement('div');
                        item.className = container.querySelector('.t-infinite-scroll__item--card')
                            ? 't-infinite-scroll__item t-infinite-scroll__item--card'
                            : 't-infinite-scroll__item';

                        const date = `2026-03-${Math.floor(Math.random() * 15) + 1}`;
                        const views = Math.floor(Math.random() * 500) + 50;
                        const likes = Math.floor(Math.random() * 300) + 50;
                        const isCard = item.classList.contains('t-infinite-scroll__item--card');

                        item.innerHTML = `
                            <div class="t-infinite-scroll__item-title">${isCard ? '卡片标题' : '列表项'} ${instance.itemCount}</div>
                            <div class="t-infinite-scroll__item-desc">这是第 ${instance.itemCount} 条数据的描述信息${isCard ? '，带有阴影效果' : ''}</div>
                            <div class="t-infinite-scroll__item-meta">
                                <span>${date}</span>
                                <span>${isCard ? '👍' : '浏览'} ${isCard ? likes : views}</span>
                            </div>
                        `;
                        list.appendChild(item);
                    }
                    instance.isLoading = false;
                    instance.loading.style.display = 'none';
                }
            }, 800);
        },

        /**
         * 重置实例
         */
        reset(id) {
            const instance = this.instances[id];
            if (!instance) return;

            instance.isLoading = false;
            instance.isFinished = false;
            instance.itemCount = instance.list.querySelectorAll('.t-infinite-scroll__item').length;
            instance.loading.style.display = 'none';
            instance.finished.style.display = 'none';
        }
    };

    // ==================== 初始化 ====================
    
    function init() {
        // 初始化所有组件
        Radio.init();
        Checkbox.init();
        Dropdown.init();
        Dialog.init();
        MessageBox.init();
        NavMenu.init();
        Backtop.init();
        Theme.init();
        Switch.init();
        Slider.init();
        Collapse.init();
        Upload.init();
        Form.init();
        Transfer.init();
        Popover.init();
        Tabs.init();
        Loading.init();
        Image.init();
        Carousel.init();
        Tree.init();
        InfiniteScroll.init();
        
        // 添加全局键盘导航支持
        document.addEventListener('keydown', (e) => {
            // Tab 键导航增强
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        setTimeout(() => {
        console.clear();
        printSKMCJ();
        printInfo();
        }, 1500);
        // console.log('🎨 Tbe UI 已加载');
    }

    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ==================== 公开 API ====================
    
    // 暴露初始化函数到全局，供VitePress页面切换时调用
    window.init = init;
    
    // 全局辅助函数 - 用于 onclick 属性直接调用
    window.showTAlert = function(options) {
        return TbeUI.Alert.show(options);
    };
    
    window.closeTAlert = function(id) {
        TbeUI.Alert.close(id);
    };
    
    window.toggleAlertDescription = function(alertId) {
        TbeUI.Alert.toggleDescription(alertId);
    };
    
    window.closeAllTAlerts = function() {
        TbeUI.Alert.closeAll();
    };
    
    window.showTAlertWithAction = function() {
        TbeUI.Alert.show({
            type: 'warning',
            title: '确认操作',
            description: '您确定要删除这条记录吗？删除后将无法恢复。',
            showConfirm: true,
            duration: 0
        });
    };
    
    window.toggleCollapse = function(header) {
        Collapse.toggle(header);
    };

    // Cascader 全局辅助函数
    window.toggleCascader = function(cascaderId) {
        Cascader.toggleCascader(cascaderId);
    };
    window.selectCascaderLevel1 = function(cascaderId, value, label) {
        Cascader.selectCascaderLevel1(cascaderId, value, label);
    };
    window.selectCascaderLevel2 = function(cascaderId, parentKey, key, name, fullPath) {
        Cascader.selectCascaderLevel2(cascaderId, parentKey, key, name, fullPath);
    };
    window.selectCascaderFinal = function(cascaderId, fullPath) {
        Cascader.selectCascaderFinal(cascaderId, fullPath);
    };
    window.clearCascader = function(cascaderId, event) {
        Cascader.clearCascader(cascaderId, event);
    };

    // ColorPicker 全局辅助函数
    window.toggleColorPicker = function(pickerId, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        ColorPicker.toggleColorPicker(pickerId);
    };
    window.selectPredefineColor = function(pickerId, color, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        ColorPicker.selectPredefineColor(pickerId, color);
    };
    window.confirmColor = function(pickerId) {
        ColorPicker.confirmColor(pickerId);
    };

    // DatePicker 全局辅助函数
    window.toggleDatePicker = function(pickerId) {
        DatePicker.toggle(pickerId);
    };
    window.changeDateMonth = function(pickerId, delta) {
        DatePicker.changeMonth(pickerId, delta);
    };
    window.selectDate = function(pickerId, dateStr) {
        DatePicker.selectDate(pickerId, dateStr);
    };
    window.clearDate = function(pickerId) {
        DatePicker.clear(pickerId);
    };

    // TimePicker 全局辅助函数
    window.toggleTimePicker = function(pickerId) {
        TimePicker.toggle(pickerId);
    };
    window.changeTimeHour = function(pickerId, delta) {
        TimePicker.changeHour(pickerId, delta);
    };
    window.selectTime = function(pickerId, timeStr) {
        TimePicker.selectTime(pickerId, timeStr);
    };
    window.clearTime = function(pickerId) {
        TimePicker.clear(pickerId);
    };

    // DateTimePicker 全局辅助函数
    window.toggleDateTimePicker = function(pickerId) {
        DateTimePicker.toggle(pickerId);
    };
    window.changeDateTimeMonth = function(pickerId, delta) {
        DateTimePicker.changeMonth(pickerId, delta);
    };
    window.selectDateTimeHour = function(pickerId, hour) {
        DateTimePicker.selectHour(pickerId, hour);
    };
    window.selectDateTime = function(pickerId, dateStr) {
        DateTimePicker.selectDate(pickerId, dateStr);
    };
    window.clearDateTime = function(pickerId) {
        DateTimePicker.clear(pickerId);
    };
    window.selectDateTimeMinute = function(pickerId, minute) {
        DateTimePicker.selectMinute(pickerId, minute);
    };
    window.selectDateTimeSecond = function(pickerId, second) {
        DateTimePicker.selectSecond(pickerId, second);
    };
    window.confirmDateTimePicker = function(pickerId) {
        DateTimePicker.confirm(pickerId);
    };
    window.cancelDateTimePicker = function(pickerId) {
        DateTimePicker.cancel(pickerId);
    };

    // Checkbox 全局辅助函数
    window.toggleCheckAll = function() {
        Checkbox.toggleCheckAll();
    };
    window.toggleCheckboxButton = function(element) {
        Checkbox.toggleButton(element);
    };

    // Select 全局辅助函数
    window.toggleSelect = function(selectId) {
        Select.toggleSelect(selectId);
    };
    window.selectOption = function(selectId, value, label) {
        Select.selectOption(selectId, value, label);
    };
    window.clearSelect = function(selectId, event) {
        Select.clearSelect(selectId, event);
    };

    // Tag 标签全局辅助函数
    window.removeTag = function(closeBtn) {
        Tag.remove(closeBtn);
    };
    window.removeDynamicTag = function(closeBtn) {
        Tag.removeDynamic(closeBtn);
    };
    window.showTagInput = function(groupId) {
        Tag.showInput(groupId);
    };
    window.hideTagInput = function(groupId) {
        Tag.hideInput(groupId);
    };
    window.handleTagInput = function(event, groupId) {
        Tag.handleInput(event, groupId);
    };

    // Avatar 头像全局辅助函数
    window.handleAvatarError = function(img, fallbackText) {
        Avatar.handleError(img, fallbackText);
    };

    // Tree 树形控件全局辅助函数
    window.renderTree = function(treeId, data, options) {
        Tree.renderTree(treeId, data, options);
    };
    window.filterTree = function(keyword) {
        Tree.filterTree(keyword);
    };
    window.toggleTreeNode = function(nodeId) {
        const nodeEl = document.querySelector(`[data-node-id="${nodeId}"]`);
        if (nodeEl) {
            const treeId = nodeEl.closest('.t-tree').id;
            const state = Tree.states[treeId];
            if (state) {
                const node = Tree.findNodeInTree(state.data, parseInt(nodeId));
                if (node) {
                    Tree.toggleNode(treeId, node, nodeEl);
                }
            }
        }
    };

    // Pagination 分页组件全局辅助函数
    window.createPagination = function(containerId, options) {
        Pagination.create(containerId, options);
    };
    window.changePaginationPage = function(containerId, page) {
        Pagination.changePage(containerId, page);
    };
    window.changePaginationPageSize = function(containerId, pageSize) {
        Pagination.changePageSize(containerId, pageSize);
    };

    // Progress 进度条全局辅助函数
    window.startProgress = function(progressId, targetPercent, duration) {
        const progressBar = document.getElementById(progressId);
        if (!progressBar) return;

        const target = Math.min(100, Math.max(0, targetPercent));
        const durationMs = duration || 1000;
        const startWidth = parseFloat(progressBar.style.width) || 0;
        const startTime = performance.now();

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            const easeOutQuad = progress * (2 - progress);
            const currentWidth = startWidth + (target - startWidth) * easeOutQuad;

            progressBar.style.width = currentWidth + '%';

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    };

    // Tabs 标签页全局辅助函数
    window.switchTab = function(tabsId, index) {
        const tabs = document.getElementById(tabsId);
        if (!tabs) return;

        const items = tabs.querySelectorAll('.t-tabs__item');
        const panes = tabs.querySelectorAll('.t-tabs__pane');

        items.forEach((item, i) => {
            item.classList.remove('is-active');
            if (i === index) {
                item.classList.add('is-active');
            }
        });

        panes.forEach((pane, i) => {
            pane.classList.remove('is-active');
            if (i === index) {
                pane.classList.add('is-active');
            }
        });
    };

    window.addTab = function(tabsId) {
        const tabs = document.getElementById(tabsId);
        if (!tabs) return;

        const nav = tabs.querySelector('.t-tabs__nav') || tabs.querySelector('#' + tabsId + '-nav');
        const content = tabs.querySelector('.t-tabs__content') || tabs.querySelector('#' + tabsId + '-content');
        if (!nav || !content) return;

        const items = nav.querySelectorAll('.t-tabs__item');
        const panes = content.querySelectorAll('.t-tabs__pane');
        const newIndex = items.length;

        const newTab = document.createElement('div');
        newTab.className = 't-tabs__item';
        newTab.setAttribute('data-index', newIndex);
        newTab.setAttribute('onclick', `switchTab('${tabsId}', ${newIndex})`);
        newTab.innerHTML = `新标签 ${newIndex + 1} <span class="t-tabs__close" onclick="removeTab(event, '${tabsId}', ${newIndex})">×</span>`;
        nav.appendChild(newTab);

        const newPane = document.createElement('div');
        newPane.className = 't-tabs__pane';
        newPane.textContent = `新标签 ${newIndex + 1} 内容`;
        content.appendChild(newPane);

        switchTab(tabsId, newIndex);
    };

    window.removeTab = function(event, tabsId, index) {
        event.stopPropagation();
        const tabs = document.getElementById(tabsId);
        if (!tabs) return;

        const nav = tabs.querySelector('.t-tabs__nav') || tabs.querySelector('#' + tabsId + '-nav');
        const content = tabs.querySelector('.t-tabs__content') || tabs.querySelector('#' + tabsId + '-content');
        if (!nav || !content) return;

        const items = nav.querySelectorAll('.t-tabs__item');
        const panes = content.querySelectorAll('.t-tabs__pane');

        if (items.length <= 1) return;

        const currentIndex = parseInt(nav.querySelector('.is-active')?.getAttribute('data-index')) || 0;

        if (items[index]) {
            items[index].remove();
        }
        if (panes[index]) {
            panes[index].remove();
        }

        let newActiveIndex = currentIndex;
        if (index === currentIndex) {
            newActiveIndex = Math.max(0, currentIndex - 1);
        } else if (index < currentIndex) {
            newActiveIndex = currentIndex - 1;
        }

        switchTab(tabsId, newActiveIndex);
    };

    // Radio 单选框全局辅助函数
    window.selectRadioButton = function(button, groupName) {
        Radio.selectRadioButton(button, groupName);
    };

    // Input 输入框全局辅助函数
    window.clearInput = function(inputId) {
        Input.clearInput(inputId);
    };
    window.togglePassword = function(inputId, icon) {
        Input.togglePassword(inputId, icon);
    };
    window.autoResize = function(textarea) {
        Input.autoResize(textarea);
    };
    window.updateCharCount = function(textarea, countId) {
        Input.updateCharCount(textarea, countId);
    };

    // InputNumber 计数器全局辅助函数
    window.changeNumber = function(inputId, delta) {
        InputNumber.changeNumber(inputId, delta);
    };
    window.changeNumberStep = function(inputId, delta, step) {
        InputNumber.changeNumberStep(inputId, delta, step);
    };
    window.changeNumberStrict = function(inputId, delta, step) {
        InputNumber.changeNumberStrict(inputId, delta, step);
    };

    // Switch 开关全局辅助函数
    window.toggleSwitch = function(switchId) {
        Switch.toggleSwitch(switchId);
    };

    // Slider 滑块全局辅助函数
    window.clickSlider = function(event, sliderId) {
        Slider.clickSlider(event, sliderId);
    };
    window.startDragSlider = function(event, sliderId, buttonIdx) {
        Slider.startDragSlider(event, sliderId, buttonIdx);
    };

    // Rate 评分全局辅助函数
    window.setRate = function(id, value) {
        Rate.setRate(id, value);
    };
    window.hoverRate = function(id, value) {
        Rate.hoverRate(id, value);
    };
    window.leaveRate = function(id) {
        Rate.leaveRate(id);
    };

    // Form 表单全局辅助函数
    window.changeLabelPosition = function(formId, position) {
        Form.changeLabelPosition(formId, position);
    };

    // TimePicker 时间选择器全局辅助函数
    window.toggleTimePicker = function(pickerId) {
        TimePicker.toggle(pickerId);
    };
    window.selectTime = function(pickerId, time) {
        TimePicker.selectTime(pickerId, time);
    };
    window.selectHour = function(pickerId, hour) {
        TimePicker.selectHour(pickerId, hour);
    };
    window.selectMinute = function(pickerId, minute) {
        TimePicker.selectMinute(pickerId, minute);
    };
    window.confirmTimePicker = function(pickerId) {
        TimePicker.confirm(pickerId);
    };
    window.cancelTimePicker = function(pickerId) {
        TimePicker.cancel(pickerId);
    };

    window.switchTab = function(tabsId, index) {
        const tabs = document.getElementById(tabsId);
        if (!tabs) return;

        const items = tabs.querySelectorAll('.t-tabs__item');
        const panes = tabs.querySelectorAll('.t-tabs__pane');

        // 移除所有活动状态
        items.forEach(item => item.classList.remove('is-active'));
        panes.forEach(pane => pane.classList.remove('is-active'));

        // 添加活动状态到指定索引
        if (items[index]) {
            items[index].classList.add('is-active');
        }
        if (panes[index]) {
            panes[index].classList.add('is-active');
        }
    };
    
    // 动态标签页计数器
    let tabCounter = 2;
    
    window.closeTab = function(event, tabsId, index) {
        event.stopPropagation();
        
        const tabs = document.getElementById(tabsId);
        if (!tabs) return;
        
        const nav = tabs.querySelector('.t-tabs__nav');
        const content = tabs.querySelector('.t-tabs__content');
        if (!nav || !content) return;
        
        const items = nav.querySelectorAll('.t-tabs__item');
        const panes = content.querySelectorAll('.t-tabs__pane');
        
        // 至少保留一个标签
        if (items.length <= 1) {
            alert('至少保留一个标签页');
            return;
        }
        
        // 移除指定标签
        if (items[index]) {
            items[index].remove();
        }
        if (panes[index]) {
            panes[index].remove();
        }
        
        // 重新索引
        const newItems = nav.querySelectorAll('.t-tabs__item');
        newItems.forEach((item, i) => {
            item.setAttribute('data-index', i);
            item.setAttribute('onclick', `switchTab('${tabsId}', ${i})`);
            const closeBtn = item.querySelector('.t-tabs__close');
            if (closeBtn) {
                closeBtn.setAttribute('onclick', `closeTab(event, '${tabsId}', ${i})`);
            }
        });
        
        // 切换到合适的标签
        const newActiveIndex = index < newItems.length ? index : newItems.length - 1;
        window.switchTab(tabsId, newActiveIndex);
    };
    
    window.addTab = function(tabsId) {
        const tabs = document.getElementById(tabsId);
        if (!tabs) return;
        
        const nav = tabs.querySelector('.t-tabs__nav');
        const content = tabs.querySelector('.t-tabs__content');
        if (!nav || !content) return;
        
        const index = nav.querySelectorAll('.t-tabs__item').length;
        tabCounter++;
        
        // 创建新标签项
        const newItem = document.createElement('div');
        newItem.className = 't-tabs__item';
        newItem.setAttribute('data-index', index);
        newItem.setAttribute('onclick', `switchTab('${tabsId}', ${index})`);
        newItem.innerHTML = `
            <span>新标签 ${tabCounter}</span>
            <span class="t-tabs__close" onclick="closeTab(event, '${tabsId}', ${index})">×</span>
        `;
        
        // 创建新内容面板
        const newPane = document.createElement('div');
        newPane.className = 't-tabs__pane';
        newPane.textContent = `新标签 ${tabCounter} 内容`;
        
        // 添加到 DOM
        nav.appendChild(newItem);
        content.appendChild(newPane);
        
        // 切换到新标签
        window.switchTab(tabsId, index);
    };

    // Message 全局辅助函数
    window.showTMessage = function(options) {
        return TbeUI.Message.show(options);
    };

    // 兼容性别名 - 文档中使用 showMessage
    window.showMessage = window.showTMessage;

    window.closeTMessage = function(id) {
        const el = typeof id === 'string' ? document.getElementById(id) : id;
        if (el) TbeUI.Message.close(el);
    };

    // 兼容性别名
    window.closeMessage = window.closeTMessage;

    window.closeAllTMessages = function() {
        TbeUI.Message.closeAll();
    };

    // 兼容性别名
    window.closeAllMessages = window.closeAllTMessages;

    // Message 辅助函数
    window.showLoadingMessage = function() {
        const loadingMsg = showTMessage({
            type: 'loading',
            message: '正在加载中...',
            duration: 0,
            showClose: true
        });
        setTimeout(() => {
            closeTMessage(loadingMsg);
            showTMessage({ type: 'success', message: '加载完成！' });
        }, 3000);
    };

    window.showProgressMessage = function() {
        const msg = showTMessage({
            type: 'loading',
            message: '上传中 0%',
            duration: 0,
            showClose: true
        });

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                closeTMessage(msg);
                showTMessage({ type: 'success', message: '上传成功！' });
            } else {
                const msgEl = typeof msg === 'string' ? document.getElementById(msg) : msg;
                if (msgEl) {
                    const textEl = msgEl.querySelector('.t-message__content') || msgEl.querySelector('.t-message span');
                    if (textEl) {
                        textEl.textContent = '上传中 ' + Math.round(progress) + '%';
                    }
                }
            }
        }, 300);
    };

    // MessageBox 辅助函数
    window.showMultiButtonMessageBox = function() {
        TMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            cancelButtonClass: 't-button--default'
        }).then(() => {
            TMessageBox.alert('你选择了删除', '提示');
        }).catch(() => {
            TMessage.info('已取消删除');
        });
    };

    window.showCustomButtonMessageBox = function() {
        TMessageBox.confirm('请选择操作', '提示', {
            showCancelButton: true,
            confirmButtonText: '操作一',
            cancelButtonText: '操作二',
            buttonLayout: 'custom'
        }).then(() => {
            TMessage.success('你选择了操作一');
        }).catch(() => {
            TMessage.info('你选择了操作二');
        });
    };

    window.showAsyncMessageBox = function() {
        const msg = TMessageBox.alert('2秒后自动关闭', '提示', {
            showClose: true,
            beforeClose: (action, instance, done) => {
                if (action === 'close') {
                    setTimeout(() => {
                        done();
                    }, 2000);
                } else {
                    done();
                }
            }
        });
    };

    window.showLoadingMessageBox = function() {
        const msg = TMessageBox.confirm('正在提交...', '提示', {
            showCancelButton: true,
            confirmButtonText: '提交中...',
            loading: true,
            beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                    setTimeout(() => {
                        done();
                        TMessage.success('提交成功');
                    }, 2000);
                } else {
                    done();
                }
            }
        });
    };

    // Dialog 对话框全局辅助函数
    window.openDialog = function(dialogId) {
        const wrapper = document.getElementById(dialogId);
        if (wrapper) {
            wrapper.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                wrapper.classList.add('active');
                const dialog = wrapper.querySelector('.t-dialog--draggable');
                if (dialog) {
                    Dialog.initDraggable(dialog);
                }
            }, 10);
        }
    };

    window.closeDialog = function(dialogId) {
        const wrapper = document.getElementById(dialogId);
        if (wrapper) {
            wrapper.classList.remove('active');
            setTimeout(() => {
                wrapper.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    };

    // Drawer 抽屉全局辅助函数
    window.openDrawer = function(direction) {
        Drawer.open(direction);
    };
    window.closeDrawer = function(direction) {
        Drawer.close(direction);
    };
    window.openDrawerWithSize = function(direction, size) {
        Drawer.open(direction, { size: size });
    };
    window.openDrawerWithFooter = function() {
        Drawer.open('right', {
            title: '带页脚的抽屉',
            content: '<p>这是抽屉的内容区域</p>',
            showFooter: true,
            footer: '<button class="t-button" onclick="closeDrawer(\'right\')">取消</button> <button class="t-button t-button--primary" onclick="TMessage.success(\'点击确认\'); closeDrawer(\'right\')">确认</button>'
        });
    };
    window.openDrawerWithForm = function() {
        Drawer.open('right', {
            title: '表单抽屉',
            size: '400px',
            content: `
                <div class="t-form" style="max-width: 300px;">
                    <div class="t-form__item">
                        <label class="t-form__label">姓名</label>
                        <input type="text" class="t-input t-p-5" placeholder="请输入姓名">
                    </div>
                    <div class="t-form__item" style="margin-top: 16px;">
                        <label class="t-form__label">邮箱</label>
                        <input type="text" class="t-input t-p-5" placeholder="请输入邮箱">
                    </div>
                </div>
            `,
            showFooter: true,
            footer: '<button class="t-button" onclick="closeDrawer(\'right\')">取消</button> <button class="t-button t-button--primary" onclick="TMessage.success(\'提交成功\'); closeDrawer(\'right\')">提交</button>'
        });
    };

    // Notification 全局辅助函数
    window.showNotification = function(options) {
        return TbeUI.Notification.show(options);
    };

    window.closeNotification = function(id) {
        TbeUI.Notification.close(id);
    };

    window.closeAllNotifications = function() {
        TbeUI.Notification.closeAll();
    };

    window.showNotificationWithAction = function() {
        return TbeUI.Notification.showNotificationWithAction();
    };

    window.showGroupedNotifications = function() {
        return TbeUI.Notification.showGroupedNotifications();
    };

    // MessageBox 全局辅助函数
    window.TMessageBox = {
        alert: function(message, title, options) {
            return MessageBox.alert(message, title, options);
        },
        confirm: function(message, title, options) {
            return MessageBox.confirm(message, title, options);
        },
        prompt: function(message, title, options) {
            return MessageBox.prompt(message, title, options);
        },
        success: function(message, title) {
            return MessageBox.success(message, title);
        },
        warning: function(message, title) {
            return MessageBox.warning(message, title);
        },
        error: function(message, title) {
            return MessageBox.error(message, title);
        },
        info: function(message, title) {
            return MessageBox.info(message, title);
        },
        close: function() {
            return MessageBox.close();
        }
    };

    // TMessage 全局辅助函数 (用于文档中 onclick="TMessage.info(...)" 调用)
    window.TMessage = {
        success: function(message, duration) {
            return TbeUI.Message.show({ type: 'success', message: message, duration: duration });
        },
        warning: function(message, duration) {
            return TbeUI.Message.show({ type: 'warning', message: message, duration: duration });
        },
        error: function(message, duration) {
            return TbeUI.Message.show({ type: 'error', message: message, duration: duration });
        },
        info: function(message, duration) {
            return TbeUI.Message.show({ type: 'info', message: message, duration: duration });
        },
        loading: function(message, duration) {
            return TbeUI.Message.show({ type: 'loading', message: message, duration: 0 });
        },
        closeAll: function() {
            return TbeUI.Message.closeAll();
        }
    };

    window.TLoading = Loading;

    // ==================== Upload 上传组件全局辅助函数 ====================
    
    // 存储上传状态
    window.uploadStates = window.uploadStates || {};
    
    // 格式化文件大小
    window.formatFileSize = function(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    // 处理文件选择
    window.handleFileSelect = function(uploadId, files) {
        if (!window.uploadStates[uploadId]) {
            window.uploadStates[uploadId] = { files: [] };
        }
        
        const state = window.uploadStates[uploadId];
        const upload = document.getElementById(uploadId);
        const fileList = upload.querySelector('.t-upload__file-list');
        
        Array.from(files).forEach(file => {
            const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            const fileItem = {
                id: fileId,
                file: file,
                name: file.name,
                size: file.size,
                status: 'ready',
                progress: 0
            };
            
            state.files.push(fileItem);
            window.addFileToList(fileList, fileItem, uploadId);
        });
    };
    
    // 添加文件到列表
    window.addFileToList = function(fileList, fileItem, uploadId) {
        const li = document.createElement('li');
        li.className = 't-upload__file-item t-border-box--inset-sm';
        li.dataset.fileId = fileItem.id;
        
        const size = window.formatFileSize(fileItem.size);
        
        li.innerHTML = `
            <span class="t-upload__file-name">${fileItem.name}</span>
            <span class="t-upload__file-size">${size}</span>
            <span class="t-upload__file-status">待上传</span>
            <div class="t-upload__file-progress" style="display: none;">
                <div class="t-upload__file-progress-bar" style="width: 0%"></div>
            </div>
            <button class="t-upload__file-remove" onclick="window.removeFile('${uploadId}', '${fileItem.id}')">
                <i class="t-icon-close"></i>
            </button>
        `;
        
        fileList.appendChild(li);
    };
    
    // 移除文件
    window.removeFile = function(uploadId, fileId) {
        const state = window.uploadStates[uploadId];
        if (!state) return;
        
        const index = state.files.findIndex(f => f.id === fileId);
        if (index > -1) {
            state.files.splice(index, 1);
        }
        
        const upload = document.getElementById(uploadId);
        const fileItem = upload.querySelector(`[data-file-id="${fileId}"]`);
        if (fileItem) {
            fileItem.remove();
        }
    };
    
    // 拖拽处理
    window.handleDragOver = function(e) {
        e.preventDefault();
        e.currentTarget.classList.add('is-dragover');
    };
    
    window.handleDragLeave = function(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('is-dragover');
    };
    
    window.handleDrop = function(e, uploadId) {
        e.preventDefault();
        e.currentTarget.classList.remove('is-dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            window.handleFileSelect(uploadId, files);
        }
    };
    
    // 图片选择处理
    window.handleImageSelect = function(uploadId, files) {
        if (!window.uploadStates[uploadId]) {
            window.uploadStates[uploadId] = { files: [] };
        }
        
        const state = window.uploadStates[uploadId];
        const pictureList = document.getElementById(uploadId + '-picture-list');
        
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;
            
            const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            const fileItem = {
                id: fileId,
                file: file,
                name: file.name,
                size: file.size,
                status: 'ready',
                progress: 0
            };
            
            state.files.push(fileItem);
            
            // 创建图片预览
            const reader = new FileReader();
            reader.onload = function(e) {
                const div = document.createElement('div');
                div.className = 't-upload__picture-item';
                div.dataset.fileId = fileId;
                div.innerHTML = `
                    <img src="${e.target.result}" alt="${file.name}">
                    <div class="t-upload__picture-mask">
                        <span class="t-upload__picture-status">待上传</span>
                        <div class="t-upload__picture-progress">
                            <div class="t-upload__picture-progress-bar" style="width: 0%"></div>
                        </div>
                    </div>
                    <button class="t-upload__picture-remove" onclick="window.removeImage('${uploadId}', '${fileId}')">
                        <i class="t-icon-close"></i>
                    </button>
                `;
                pictureList.appendChild(div);
            };
            reader.readAsDataURL(file);
        });
    };
    
    // 移除图片
    window.removeImage = function(uploadId, fileId) {
        const state = window.uploadStates[uploadId];
        if (!state) return;
        
        const index = state.files.findIndex(f => f.id === fileId);
        if (index > -1) {
            state.files.splice(index, 1);
        }
        
        const pictureList = document.getElementById(uploadId + '-picture-list');
        const item = pictureList.querySelector(`[data-file-id="${fileId}"]`);
        if (item) {
            item.remove();
        }
    };
    
    // 模拟上传
    window.simulateUpload = function(uploadId) {
        const state = window.uploadStates[uploadId];
        if (!state || state.files.length === 0) {
            alert('请先选择文件');
            return;
        }
        
        state.files.forEach(fileItem => {
            if (fileItem.status !== 'ready') return;
            
            fileItem.status = 'uploading';
            window.updateImageStatus(uploadId, fileItem.id, 'uploading');
            
            // 模拟上传进度
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    fileItem.status = 'success';
                    window.updateImageStatus(uploadId, fileItem.id, 'success');
                } else {
                    window.updateImageProgress(uploadId, fileItem.id, progress);
                }
            }, 200);
        });
    };
    
    // 更新图片状态
    window.updateImageStatus = function(uploadId, fileId, status) {
        const pictureList = document.getElementById(uploadId + '-picture-list');
        const item = pictureList.querySelector(`[data-file-id="${fileId}"]`);
        if (!item) return;
        
        const statusEl = item.querySelector('.t-upload__picture-status');
        const statusText = {
            'ready': '待上传',
            'uploading': '上传中',
            'success': '上传成功',
            'error': '上传失败'
        };
        if (statusEl) {
            statusEl.textContent = statusText[status] || status;
            statusEl.className = 't-upload__picture-status is-' + status;
        }
    };
    
    // 更新图片进度
    window.updateImageProgress = function(uploadId, fileId, progress) {
        const pictureList = document.getElementById(uploadId + '-picture-list');
        const item = pictureList.querySelector(`[data-file-id="${fileId}"]`);
        if (!item) return;
        
        const progressBar = item.querySelector('.t-upload__picture-progress-bar');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    };
    
    // 头像选择处理
    window.handleAvatarSelect = function(uploadId, file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('请选择图片文件');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById(uploadId + '-preview');
            preview.src = e.target.result;
            
            // 显示上传成功提示
            if (window.showMessage) {
                window.showMessage({
                    type: 'success',
                    message: '头像更换成功',
                    duration: 2000
                });
            }
        };
        reader.readAsDataURL(file);
    };
    
    // 带预览的文件选择
    window.handleFileSelectWithPreview = function(uploadId, files) {
        if (!window.uploadStates[uploadId]) {
            window.uploadStates[uploadId] = { files: [] };
        }
        
        const state = window.uploadStates[uploadId];
        const list = document.getElementById(uploadId + '-list');
        
        Array.from(files).forEach(file => {
            const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            const fileItem = {
                id: fileId,
                file: file,
                name: file.name,
                size: file.size,
                status: 'ready',
                progress: 0
            };
            
            state.files.push(fileItem);
            
            const li = document.createElement('li');
            li.className = 't-upload__file-item t-border-box--inset-sm';
            li.dataset.fileId = fileId;
            li.innerHTML = `
                <span class="t-upload__file-name">${file.name}</span>
                <span class="t-upload__file-size">${window.formatFileSize(file.size)}</span>
                <span class="t-upload__file-status">待上传</span>
                <div class="t-upload__file-progress">
                    <div class="t-upload__file-progress-bar" style="width: 0%"></div>
                </div>
                <button class="t-upload__file-remove" onclick="window.removeFileItem('${uploadId}', '${fileId}')">
                    <i class="t-icon-close"></i>
                </button>
            `;
            list.appendChild(li);
        });
    };
    
    // 移除文件项
    window.removeFileItem = function(uploadId, fileId) {
        const state = window.uploadStates[uploadId];
        if (!state) return;
        
        const index = state.files.findIndex(f => f.id === fileId);
        if (index > -1) {
            state.files.splice(index, 1);
        }
        
        const list = document.getElementById(uploadId + '-list');
        const item = list.querySelector(`[data-file-id="${fileId}"]`);
        if (item) {
            item.remove();
        }
    };
    
    // 带进度的模拟上传
    window.simulateUploadWithProgress = function(uploadId) {
        const state = window.uploadStates[uploadId];
        if (!state || state.files.length === 0) {
            if (window.showMessage) {
                window.showMessage({
                    type: 'warning',
                    message: '请先选择文件',
                    duration: 2000
                });
            }
            return;
        }
        
        let completedCount = 0;
        
        state.files.forEach(fileItem => {
            if (fileItem.status !== 'ready') {
                completedCount++;
                return;
            }
            
            fileItem.status = 'uploading';
            window.updateFileItemStatus(uploadId, fileItem.id, 'uploading');
            
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    fileItem.status = Math.random() > 0.1 ? 'success' : 'error';
                    window.updateFileItemStatus(uploadId, fileItem.id, fileItem.status);
                    window.updateFileItemProgress(uploadId, fileItem.id, 100);
                    
                    completedCount++;
                    if (completedCount >= state.files.length) {
                        const successCount = state.files.filter(f => f.status === 'success').length;
                        if (window.showMessage) {
                            window.showMessage({
                                type: successCount > 0 ? 'success' : 'error',
                                message: `上传完成：${successCount}/${state.files.length} 个文件上传成功`,
                                duration: 3000
                            });
                        }
                    }
                } else {
                    window.updateFileItemProgress(uploadId, fileItem.id, progress);
                }
            }, 300);
        });
    };
    
    // 更新文件项状态
    window.updateFileItemStatus = function(uploadId, fileId, status) {
        const list = document.getElementById(uploadId + '-list');
        const item = list.querySelector(`[data-file-id="${fileId}"]`);
        if (!item) return;
        
        const statusEl = item.querySelector('.t-upload__file-status');
        const statusText = {
            'ready': '待上传',
            'uploading': '上传中',
            'success': '上传成功',
            'error': '上传失败'
        };
        if (statusEl) {
            statusEl.textContent = statusText[status] || status;
            statusEl.className = 't-upload__file-status is-' + status;
        }
    };
    
    // 更新文件项进度
    window.updateFileItemProgress = function(uploadId, fileId, progress) {
        const list = document.getElementById(uploadId + '-list');
        const item = list.querySelector(`[data-file-id="${fileId}"]`);
        if (!item) return;
        
        const progressBar = item.querySelector('.t-upload__file-progress-bar');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    };
    
    // 清空上传
    window.clearUpload = function(uploadId) {
        window.uploadStates[uploadId] = { files: [] };
        const list = document.getElementById(uploadId + '-list');
        if (list) {
            list.innerHTML = '';
        }
    };
    
    // 多文件选择处理
    window.handleMultiFileSelect = function(uploadId, files) {
        if (!window.uploadStates[uploadId]) {
            window.uploadStates[uploadId] = { files: [] };
        }
        
        const state = window.uploadStates[uploadId];
        const table = document.getElementById(uploadId + '-table');
        const tbody = table.querySelector('tbody');
        const empty = document.getElementById(uploadId + '-empty');
        
        table.style.display = 'block';//table
        empty.style.display = 'none';
        
        Array.from(files).forEach(file => {
            const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            const fileItem = {
                id: fileId,
                file: file,
                name: file.name,
                size: file.size,
                status: 'ready'
            };
            
            state.files.push(fileItem);
            
            const tr = document.createElement('tr');
            tr.dataset.fileId = fileId;
            tr.innerHTML = `
                <td>${file.name}</td>
                <td>${window.formatFileSize(file.size)}</td>
                <td><span class="t-tag">待上传</span></td>
                <td>
                    <button class="t-btn t-btn--text" onclick="window.removeTableFile('${uploadId}', '${fileId}')">
                        <i class="t-icon-delete"></i> 删除
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    };
    
    // 删除表格中的文件
    window.removeTableFile = function(uploadId, fileId) {
        const state = window.uploadStates[uploadId];
        if (!state) return;
        
        const index = state.files.findIndex(f => f.id === fileId);
        if (index > -1) {
            state.files.splice(index, 1);
        }
        
        const table = document.getElementById(uploadId + '-table');
        const tbody = table.querySelector('tbody');
        const row = tbody.querySelector(`[data-file-id="${fileId}"]`);
        if (row) {
            row.remove();
        }
        
        if (state.files.length === 0) {
            table.style.display = 'none';
            document.getElementById(uploadId + '-empty').style.display = 'block';
        }
    };

    // ==================== Transfer 穿梭框全局辅助函数 ====================

    window.transferToTarget = function(transferId) {
        const sourceList = document.getElementById(transferId + '-source-list');
        const targetList = document.getElementById(transferId + '-target-list');
        if (!sourceList || !targetList) return;

        const checkedItems = sourceList.querySelectorAll('input[type="checkbox"]:checked');
        checkedItems.forEach(checkbox => {
            const item = checkbox.closest('.t-transfer-item');
            checkbox.checked = false;
            targetList.appendChild(item);
        });

        window.updateTransferSelection(transferId);
    };

    window.transferToSource = function(transferId) {
        const sourceList = document.getElementById(transferId + '-source-list');
        const targetList = document.getElementById(transferId + '-target-list');
        if (!sourceList || !targetList) return;

        const checkedItems = targetList.querySelectorAll('input[type="checkbox"]:checked');
        checkedItems.forEach(checkbox => {
            const item = checkbox.closest('.t-transfer-item');
            checkbox.checked = false;
            sourceList.appendChild(item);
        });

        window.updateTransferSelection(transferId);
    };

    window.toggleTransferAll = function(transferId, panel) {
        const checkbox = document.getElementById(transferId + '-' + panel + '-all');
        const list = document.getElementById(transferId + '-' + panel + '-list');
        if (!checkbox || !list) return;

        const items = list.querySelectorAll('.t-transfer-item:not([style*="display: none"]) input[type="checkbox"]');
        items.forEach(item => {
            item.checked = checkbox.checked;
        });

        window.updateTransferSelection(transferId);
    };

    window.filterTransfer = function(transferId, panel, keyword) {
        const list = document.getElementById(transferId + '-' + panel + '-list');
        if (!list) return;
        const items = list.querySelectorAll('.t-transfer-item');

        items.forEach(item => {
            const label = item.querySelector('.t-transfer-item-label');
            if (!label) return;
            const text = label.textContent.toLowerCase();
            const dataLabel = item.getAttribute('data-label') || '';
            if (text.includes(keyword.toLowerCase()) || dataLabel.toLowerCase().includes(keyword.toLowerCase())) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });

        window.updateTransferSelection(transferId);
    };

    window.updateTransferSelection = function(transferId) {
        const sourceList = document.getElementById(transferId + '-source-list');
        const targetList = document.getElementById(transferId + '-target-list');
        if (!sourceList || !targetList) return;

        const sourceChecked = sourceList.querySelectorAll('input[type="checkbox"]:checked');
        const targetChecked = targetList.querySelectorAll('input[type="checkbox"]:checked');

        const sourceCountEl = document.getElementById(transferId + '-source-count');
        const targetCountEl = document.getElementById(transferId + '-target-count');
        const sourceAllCheckbox = document.getElementById(transferId + '-source-all');
        const targetAllCheckbox = document.getElementById(transferId + '-target-all');
        const toTargetBtn = document.getElementById(transferId + '-to-target');
        const toSourceBtn = document.getElementById(transferId + '-to-source');

        if (sourceCountEl) {
            const visibleSourceItems = sourceList.querySelectorAll('.t-transfer-item:not([style*="display: none"])');
            sourceCountEl.textContent = sourceChecked.length + '/' + visibleSourceItems.length;
        }
        if (targetCountEl) {
            const visibleTargetItems = targetList.querySelectorAll('.t-transfer-item:not([style*="display: none"])');
            targetCountEl.textContent = targetChecked.length + '/' + visibleTargetItems.length;
        }

        if (sourceAllCheckbox) {
            const visibleSourceItems = sourceList.querySelectorAll('.t-transfer-item:not([style*="display: none"])');
            const visibleCheckedItems = sourceList.querySelectorAll('.t-transfer-item:not([style*="display: none"]) input[type="checkbox"]:checked');
            sourceAllCheckbox.checked = visibleSourceItems.length > 0 && visibleCheckedItems.length === visibleSourceItems.length;
        }
        if (targetAllCheckbox) {
            const visibleTargetItems = targetList.querySelectorAll('.t-transfer-item:not([style*="display: none"])');
            const visibleCheckedItems = targetList.querySelectorAll('.t-transfer-item:not([style*="display: none"]) input[type="checkbox"]:checked');
            targetAllCheckbox.checked = visibleTargetItems.length > 0 && visibleCheckedItems.length === visibleTargetItems.length;
        }

        if (toTargetBtn) {
            toTargetBtn.disabled = sourceChecked.length === 0;
        }
        if (toSourceBtn) {
            toSourceBtn.disabled = targetChecked.length === 0;
        }
    };

    // ==================== 文档站点全局辅助函数 ====================
    
    // Tooltip 全局辅助函数
    window.toggleTooltip = function(id) {
        const tooltip = document.getElementById(id);
        if (tooltip) {
            tooltip.classList.toggle('is-active');
        }
    };
    
    window.showTooltip = function(id) {
        const tooltip = document.getElementById(id);
        if (tooltip) {
            tooltip.classList.add('is-active');
        }
    };
    
    window.hideTooltip = function(id) {
        const tooltip = document.getElementById(id);
        if (tooltip) {
            tooltip.classList.remove('is-active');
        }
    };

    // Loading 全局辅助函数
    let fullscreenLoadingTimer = null;
    let progressInterval = null;

    window.showFullscreenLoading = function() {
        let loading = document.getElementById('fullscreenLoading');
        if (!loading) {
            loading = document.createElement('div');
            loading.id = 'fullscreenLoading';
            loading.className = 't-loading-fullscreen';
            loading.innerHTML = `
                <div class="t-loading-content">
                    <div class="t-loading-spinner"></div>
                    <p class="t-loading-text">加载中...</p>
                </div>
            `;
            document.body.appendChild(loading);
        }
        loading.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (fullscreenLoadingTimer) {
            clearTimeout(fullscreenLoadingTimer);
        }
        fullscreenLoadingTimer = setTimeout(() => {
            window.hideFullscreenLoading();
        }, 3000);
    };

    window.hideFullscreenLoading = function() {
        const loading = document.getElementById('fullscreenLoading');
        if (loading) {
            loading.classList.remove('active');
            document.body.style.overflow = '';
        }
        if (fullscreenLoadingTimer) {
            clearTimeout(fullscreenLoadingTimer);
            fullscreenLoadingTimer = null;
        }
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    };

    window.toggleAreaLoading = function() {
        const loading = document.getElementById('areaLoading');
        if (loading) {
            loading.classList.toggle('active');
        }
    };

    window.showLoadingWithType = function(type) {
        let loading = document.getElementById('fullscreenLoading');
        if (!loading) {
            loading = document.createElement('div');
            loading.id = 'fullscreenLoading';
            loading.className = 't-loading-fullscreen';
            document.body.appendChild(loading);
        }

        const typeClasses = {
            'spinner': 't-loading-spinner',
            'ring': 't-loading-ring',
            'wave': 't-loading-wave',
            'dots': 't-loading-dots',
            'square': 't-loading-square',
            'gradient': 't-loading-gradient'
        };

        let spinnerHtml = '';
        if (type === 'wave') {
            spinnerHtml = '<div class="t-loading-wave"><span></span><span></span><span></span><span></span><span></span></div>';
        } else if (type === 'dots') {
            spinnerHtml = '<div class="t-loading-dots"><span></span><span></span><span></span></div>';
        } else {
            spinnerHtml = '<div class="' + (typeClasses[type] || 't-loading-spinner') + '"></div>';
        }

        loading.innerHTML = `
            <div class="t-loading-content">
                ${spinnerHtml}
                <p class="t-loading-text">加载中...</p>
            </div>
        `;
        loading.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (fullscreenLoadingTimer) {
            clearTimeout(fullscreenLoadingTimer);
        }
        fullscreenLoadingTimer = setTimeout(() => {
            window.hideFullscreenLoading();
        }, 3000);
    };
    
    window.showLoadingWithProgress = function() {
        let loading = document.getElementById('fullscreenLoading');
        if (!loading) {
            loading = document.createElement('div');
            loading.id = 'fullscreenLoading';
            loading.className = 't-loading-fullscreen';
            document.body.appendChild(loading);
        }

        loading.innerHTML = `
            <div class="t-loading-content">
                <div class="t-loading-container">
                    <div class="t-loading-percent" id="loadingPercent">0%</div>
                    <div class="t-loading-progress">
                        <div class="t-loading-progress-bar" id="loadingProgressBar" style="width: 0%"></div>
                    </div>
                </div>
                <p class="t-loading-text">正在加载...</p>
            </div>
        `;
        loading.classList.add('active');
        document.body.style.overflow = 'hidden';

        let progress = 0;
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                progressInterval = null;
                setTimeout(() => {
                    window.hideFullscreenLoading();
                    if (window.TMessage) {
                        window.TMessage.success('加载完成！');
                    }
                }, 500);
            }
            const progressBar = document.getElementById('loadingProgressBar');
            const percentEl = document.getElementById('loadingPercent');
            if (progressBar) progressBar.style.width = progress + '%';
            if (percentEl) percentEl.textContent = Math.round(progress) + '%';
        }, 200);
    };
    
    window.showCustomLoading = function() {
        let loading = document.getElementById('fullscreenLoading');
        if (!loading) {
            loading = document.createElement('div');
            loading.id = 'fullscreenLoading';
            loading.className = 't-loading-fullscreen';
            document.body.appendChild(loading);
        }
        loading.innerHTML = `
            <div class="t-loading-content">
                <div class="t-loading-spinner"></div>
                <p class="t-loading-text">自定义加载中...</p>
            </div>
        `;
        loading.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (fullscreenLoadingTimer) {
            clearTimeout(fullscreenLoadingTimer);
        }
        fullscreenLoadingTimer = setTimeout(() => {
            window.hideFullscreenLoading();
        }, 3000);
    };

    window.showLoadingWithIcon = function() {
        let loading = document.getElementById('fullscreenLoading');
        if (!loading) {
            loading = document.createElement('div');
            loading.id = 'fullscreenLoading';
            loading.className = 't-loading-fullscreen';
            document.body.appendChild(loading);
        }
        loading.innerHTML = `
            <div class="t-loading-content">
                <div class="t-loading-custom">
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 6v6l4 2"></path>
                    </svg>
                </div>
                <p class="t-loading-text">图标加载...</p>
            </div>
        `;
        loading.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (fullscreenLoadingTimer) {
            clearTimeout(fullscreenLoadingTimer);
        }
        fullscreenLoadingTimer = setTimeout(() => {
            window.hideFullscreenLoading();
        }, 3000);
    };
    
    window.showLoadingWithPercent = function() {
        window.showLoadingWithProgress();
    };
    
    window.loadingServiceDemo = function() {
        if (window.TLoading) {
            const loading = window.TLoading.service({
                text: '服务方式加载中...',
                spinner: 'ring',
                lock: true
            });
            setTimeout(() => {
                loading.close();
            }, 3000);
        }
    };
    
    window.loadingServiceWithTarget = function() {
        if (window.TLoading) {
            const target = document.getElementById('areaLoading');
            if (target) {
                target.classList.add('active');
                setTimeout(() => {
                    target.classList.remove('active');
                }, 3000);
            }
        }
    };

    // Carousel 全局函数
    const carousels = {};
    const autoplayIntervals = {};

    function initCarousel(id) {
        const container = document.getElementById(id);
        if (!container) return;
        const carouselEl = container.closest('.t-carousel');
        const items = container.querySelectorAll('.t-carousel-item');
        const indicators = carouselEl ? carouselEl.querySelectorAll('.t-carousel-indicator') : [];

        const isFade = carouselEl && carouselEl.classList.contains('t-carousel--fade');
        const isMulti = carouselEl && carouselEl.classList.contains('t-carousel-multi');
        const is3D = carouselEl && carouselEl.classList.contains('t-carousel-3d');
        const isVertical = carouselEl && carouselEl.classList.contains('t-carousel-vertical');
        const isCard = carouselEl && carouselEl.classList.contains('t-carousel-card');

        carousels[id] = {
            current: 0,
            total: items.length,
            container: container,
            items: items,
            indicators: indicators,
            carouselEl: carouselEl,
            isFade: isFade,
            isMulti: isMulti,
            is3D: is3D,
            isVertical: isVertical,
            isCard: isCard,
            autoplay: false
        };

        updateCarousel(id);

        if (carouselEl && carouselEl.classList.contains('t-carousel--autoplay')) {
            startAutoplay(id);
        }
    }

    function updateCarousel(id) {
        const carousel = carousels[id];
        if (!carousel) return;

        const { current, total, container, items, indicators, isFade, isMulti, is3D, isVertical, isCard } = carousel;

        if (isFade) {
            items.forEach((item, idx) => {
                item.classList.toggle('active', idx === current);
            });
        } else if (isMulti) {
            const itemsPerView = 4;
            const maxIndex = total - itemsPerView;
            const safeCurrent = Math.min(current, maxIndex);
            const offset = -safeCurrent * (100 / itemsPerView);
            container.style.transform = `translateX(${offset}%)`;

            items.forEach((item, idx) => {
                const isActive = idx >= safeCurrent && idx < safeCurrent + itemsPerView;
                item.style.opacity = isActive ? '1' : '0.5';
            });
        } else if (is3D) {
            items.forEach((item, idx) => {
                item.classList.toggle('active', idx === current);
            });
            const offset = -(current - 1) * 40;
            container.style.transform = `translateX(${offset}%)`;
        } else if (isVertical) {
            const offset = -current * 100;
            container.style.transform = `translateY(${offset}%)`;
            items.forEach((item, idx) => {
                item.classList.toggle('active', idx === current);
            });
        } else {
            const offset = -current * 100;
            container.style.transform = `translateX(${offset}%)`;

            if (isCard) {
                items.forEach((item, idx) => {
                    item.classList.toggle('active', idx === current);
                });
            }
        }

        if (indicators.length > 0) {
            indicators.forEach((ind, idx) => {
                ind.classList.toggle('active', idx === current);
            });
        }
    }

    window.nextSlide = function(id) {
        if (!carousels[id]) initCarousel(id);
        const carousel = carousels[id];
        if (!carousel) return;
        const { total, isMulti } = carousel;

        if (isMulti) {
            const itemsPerView = 4;
            const maxIndex = total - itemsPerView;
            carousel.current = carousel.current >= maxIndex ? 0 : carousel.current + 1;
        } else {
            carousel.current = (carousel.current + 1) % total;
        }

        updateCarousel(id);
    };

    window.prevSlide = function(id) {
        if (!carousels[id]) initCarousel(id);
        const carousel = carousels[id];
        if (!carousel) return;
        const { total, isMulti } = carousel;

        if (isMulti) {
            const itemsPerView = 4;
            const maxIndex = total - itemsPerView;
            carousel.current = carousel.current <= 0 ? maxIndex : carousel.current - 1;
        } else {
            carousel.current = (carousel.current - 1 + total) % total;
        }

        updateCarousel(id);
    };

    window.goToSlide = function(id, index) {
        if (!carousels[id]) initCarousel(id);
        const carousel = carousels[id];
        if (!carousel) return;
        carousel.current = index;
        updateCarousel(id);
    };

    window.startAutoplay = function(id) {
        if (autoplayIntervals[id]) {
            clearInterval(autoplayIntervals[id]);
        }

        autoplayIntervals[id] = setInterval(() => {
            window.nextSlide(id);
        }, 3000);

        if (carousels[id]) {
            carousels[id].autoplay = true;
        }
    };

    window.stopAutoplay = function(id) {
        if (autoplayIntervals[id]) {
            clearInterval(autoplayIntervals[id]);
            autoplayIntervals[id] = null;
        }

        if (carousels[id]) {
            carousels[id].autoplay = false;
        }
    };

    window.toggleAutoplay = function(id) {
        if (!carousels[id]) initCarousel(id);
        const carousel = carousels[id];
        if (!carousel) return;

        if (carousel.autoplay) {
            window.stopAutoplay(id);
        } else {
            window.startAutoplay(id);
        }
    };

    // Image 图片组件全局函数
    const imagePreviewGroup = [
        '/demo-img/129-800x600.jpg',
        '/demo-img/152-800x600.jpg',
        '/demo-img/175-800x600.jpg',
        '/demo-img/10-800x600.jpg'
    ];
    let currentPreviewIndex = 0;

    window.previewImage = function(src) {
        let overlay = document.getElementById('t-image-preview-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 't-image-preview-overlay';
            overlay.className = 't-image-preview-overlay';
            overlay.innerHTML = `
                <div class="t-image-preview-wrapper" onclick="event.stopPropagation()">
                    <img src="" alt="预览" class="t-image-preview-img">
                    <button class="t-image-preview-close" onclick="event.stopPropagation(); closeImagePreview()">×</button>
                    <button class="t-image-preview-prev" onclick="event.stopPropagation(); previewPrevImage()">‹</button>
                    <button class="t-image-preview-next" onclick="event.stopPropagation(); previewNextImage()">›</button>
                </div>
            `;
            document.body.appendChild(overlay);
            
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) closeImagePreview();
            });
            
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') closeImagePreview();
            });
        }
        
        const img = overlay.querySelector('.t-image-preview-img');
        img.src = src;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.previewImageGroup = function(index) {
        currentPreviewIndex = index;
        window.previewImage(imagePreviewGroup[index]);
    };

    window.previewPrevImage = function() {
        currentPreviewIndex = (currentPreviewIndex - 1 + imagePreviewGroup.length) % imagePreviewGroup.length;
        const img = document.querySelector('.t-image-preview-img');
        if (img) img.src = imagePreviewGroup[currentPreviewIndex];
    };

    window.previewNextImage = function() {
        currentPreviewIndex = (currentPreviewIndex + 1) % imagePreviewGroup.length;
        const img = document.querySelector('.t-image-preview-img');
        if (img) img.src = imagePreviewGroup[currentPreviewIndex];
    };

    window.closeImagePreview = function() {
        const overlay = document.getElementById('t-image-preview-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    window.hidePlaceholder = function(id, img) {
        const placeholder = document.getElementById(id);
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        img.style.display = 'block';
    };

    window.showImageError = function(img) {
        img.style.display = 'none';
        const parent = img.parentElement;
        const errorEl = parent.querySelector('.t-image__error');
        if (errorEl) {
            errorEl.style.display = 'flex';
        }
    };

    // Popover 全局辅助函数
    window.toggleTPopover = function(id) {
        const popover = document.getElementById(id);
        if (!popover) return;
        if (popover.classList.contains('is-disabled')) return;

        popover.classList.toggle('active');

        if (popover.classList.contains('active')) {
            setTimeout(() => {
                document.addEventListener('click', function closePopover(e) {
                    if (!popover.contains(e.target)) {
                        popover.classList.remove('active');
                        document.removeEventListener('click', closePopover);
                    }
                });
            }, 0);
        }
    };
    
    window.closeTPopover = function(id) {
        const popover = document.getElementById(id);
        if (popover) {
            popover.classList.remove('active');
        }
    };
    
    window.openTPopover = function(id) {
        const popover = document.getElementById(id);
        if (popover && !popover.classList.contains('is-disabled')) {
            popover.classList.add('active');
        }
    };

    // ==================== Table 表格全局辅助函数 ====================
    
    /**
     * 表格全选/取消全选
     */
    window.toggleSelectAll = function() {
        const selectAllCheckbox = document.getElementById('selectAll');
        if (!selectAllCheckbox) return;
        const rowCheckboxes = document.querySelectorAll('.row-checkbox');
        rowCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
    };

    // ==================== Upload 上传组件全局辅助函数 ====================
    
    /**
     * 存储上传状态
     */
    window.uploadStates = {};

    /**
     * 处理文件选择
     * @param {string} uploadId - 上传组件ID
     * @param {FileList} files - 文件列表
     */
    window.handleFileSelect = function(uploadId, files) {
        if (!window.uploadStates[uploadId]) {
            window.uploadStates[uploadId] = { files: [] };
        }
        
        const state = window.uploadStates[uploadId];
        const upload = document.getElementById(uploadId);
        const fileList = upload.querySelector('.t-upload__file-list');
        
        Array.from(files).forEach(file => {
            const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            const fileItem = {
                id: fileId,
                file: file,
                name: file.name,
                size: file.size,
                status: 'ready',
                progress: 0
            };
            
            state.files.push(fileItem);
            window.addFileToList(fileList, fileItem, uploadId);
        });
    };

    /**
     * 添加文件到列表
     * @param {HTMLElement} fileList - 文件列表元素
     * @param {Object} fileItem - 文件项
     * @param {string} uploadId - 上传组件ID
     */
    window.addFileToList = function(fileList, fileItem, uploadId) {
        const li = document.createElement('li');
        li.className = 't-upload__file-item t-border-box--inset-sm';
        li.dataset.fileId = fileItem.id;
        
        const size = window.formatFileSize(fileItem.size);
        
        li.innerHTML = `
            <span class="t-upload__file-name">${fileItem.name}</span>
            <span class="t-upload__file-size">${size}</span>
            <span class="t-upload__file-status">待上传</span>
            <div class="t-upload__file-progress" style="display: none;">
                <div class="t-upload__file-progress-bar" style="width: 0%"></div>
            </div>
            <button class="t-upload__file-remove" onclick="removeFile('${uploadId}', '${fileItem.id}')">
                <i class="t-icon-close"></i>
            </button>
        `;
        
        fileList.appendChild(li);
    };

    /**
     * 格式化文件大小
     * @param {number} bytes - 字节数
     * @returns {string} 格式化后的文件大小
     */
    window.formatFileSize = function(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    /**
     * 移除文件
     * @param {string} uploadId - 上传组件ID
     * @param {string} fileId - 文件ID
     */
    window.removeFile = function(uploadId, fileId) {
        const state = window.uploadStates[uploadId];
        if (!state) return;
        
        const index = state.files.findIndex(f => f.id === fileId);
        if (index > -1) {
            state.files.splice(index, 1);
        }
        
        const upload = document.getElementById(uploadId);
        const fileItem = upload.querySelector(`[data-file-id="${fileId}"]`);
        if (fileItem) {
            fileItem.remove();
        }
    };

    /**
     * 拖拽处理 - 拖拽悬停
     * @param {DragEvent} e - 拖拽事件
     */
    window.handleDragOver = function(e) {
        e.preventDefault();
        e.currentTarget.classList.add('is-dragover');
    };

    /**
     * 拖拽处理 - 拖拽离开
     * @param {DragEvent} e - 拖拽事件
     */
    window.handleDragLeave = function(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('is-dragover');
    };

    /**
     * 拖拽处理 - 放置文件
     * @param {DragEvent} e - 拖拽事件
     * @param {string} uploadId - 上传组件ID
     */
    window.handleDrop = function(e, uploadId) {
        e.preventDefault();
        e.currentTarget.classList.remove('is-dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            window.handleFileSelect(uploadId, files);
        }
    };

    /**
     * 图片选择处理
     * @param {string} uploadId - 上传组件ID
     * @param {FileList} files - 文件列表
     */
    window.handleImageSelect = function(uploadId, files) {
        if (!window.uploadStates[uploadId]) {
            window.uploadStates[uploadId] = { files: [] };
        }
        
        const state = window.uploadStates[uploadId];
        const pictureList = document.getElementById(uploadId + '-picture-list');
        
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;
            
            const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            const fileItem = {
                id: fileId,
                file: file,
                name: file.name,
                size: file.size,
                status: 'ready',
                progress: 0
            };
            
            state.files.push(fileItem);
            
            // 创建图片预览
            const reader = new FileReader();
            reader.onload = function(e) {
                const div = document.createElement('div');
                div.className = 't-upload__picture-item';
                div.dataset.fileId = fileId;
                div.innerHTML = `
                    <img src="${e.target.result}" alt="${file.name}">
                    <div class="t-upload__picture-mask">
                        <span class="t-upload__picture-status">待上传</span>
                        <div class="t-upload__picture-progress">
                            <div class="t-upload__picture-progress-bar" style="width: 0%"></div>
                        </div>
                    </div>
                    <button class="t-upload__picture-remove" onclick="removeImage('${uploadId}', '${fileId}')">
                        <i class="t-icon-close"></i>
                    </button>
                `;
                pictureList.appendChild(div);
            };
            reader.readAsDataURL(file);
        });
    };

    /**
     * 移除图片
     * @param {string} uploadId - 上传组件ID
     * @param {string} fileId - 文件ID
     */
    window.removeImage = function(uploadId, fileId) {
        const state = window.uploadStates[uploadId];
        if (!state) return;
        
        const index = state.files.findIndex(f => f.id === fileId);
        if (index > -1) {
            state.files.splice(index, 1);
        }
        
        const pictureList = document.getElementById(uploadId + '-picture-list');
        const item = pictureList.querySelector(`[data-file-id="${fileId}"]`);
        if (item) {
            item.remove();
        }
    };

    /**
     * 模拟上传
     * @param {string} uploadId - 上传组件ID
     */
    window.simulateUpload = function(uploadId) {
        const state = window.uploadStates[uploadId];
        if (!state || state.files.length === 0) {
            alert('请先选择文件');
            return;
        }
        
        state.files.forEach(fileItem => {
            if (fileItem.status !== 'ready') return;
            
            fileItem.status = 'uploading';
            window.updateImageStatus(uploadId, fileItem.id, 'uploading');
            
            // 模拟上传进度
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    fileItem.status = 'success';
                    window.updateImageStatus(uploadId, fileItem.id, 'success');
                } else {
                    window.updateImageProgress(uploadId, fileItem.id, progress);
                }
            }, 200);
        });
    };

    /**
     * 更新图片状态
     * @param {string} uploadId - 上传组件ID
     * @param {string} fileId - 文件ID
     * @param {string} status - 状态
     */
    window.updateImageStatus = function(uploadId, fileId, status) {
        const pictureList = document.getElementById(uploadId + '-picture-list');
        const item = pictureList.querySelector(`[data-file-id="${fileId}"]`);
        if (!item) return;
        
        const statusEl = item.querySelector('.t-upload__picture-status');
        const statusText = {
            'ready': '待上传',
            'uploading': '上传中',
            'success': '上传成功',
            'error': '上传失败'
        };
        if (statusEl) {
            statusEl.textContent = statusText[status] || status;
            statusEl.className = 't-upload__picture-status is-' + status;
        }
    };

    /**
     * 更新图片进度
     * @param {string} uploadId - 上传组件ID
     * @param {string} fileId - 文件ID
     * @param {number} progress - 进度
     */
    window.updateImageProgress = function(uploadId, fileId, progress) {
        const pictureList = document.getElementById(uploadId + '-picture-list');
        const item = pictureList.querySelector(`[data-file-id="${fileId}"]`);
        if (!item) return;
        
        const progressBar = item.querySelector('.t-upload__picture-progress-bar');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    };

    /**
     * 头像选择处理
     * @param {string} uploadId - 上传组件ID
     * @param {File} file - 文件
     */
    window.handleAvatarSelect = function(uploadId, file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('请选择图片文件');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById(uploadId + '-preview');
            preview.src = e.target.result;
            
            // 显示上传成功提示
            if (window.showMessage) {
                window.showMessage({
                    type: 'success',
                    message: '头像更换成功',
                    duration: 2000
                });
            }
        };
        reader.readAsDataURL(file);
    };

    /**
     * 带预览的文件选择
     * @param {string} uploadId - 上传组件ID
     * @param {FileList} files - 文件列表
     */
    window.handleFileSelectWithPreview = function(uploadId, files) {
        if (!window.uploadStates[uploadId]) {
            window.uploadStates[uploadId] = { files: [] };
        }
        
        const state = window.uploadStates[uploadId];
        const list = document.getElementById(uploadId + '-list');
        
        Array.from(files).forEach(file => {
            const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            const fileItem = {
                id: fileId,
                file: file,
                name: file.name,
                size: file.size,
                status: 'ready',
                progress: 0
            };
            
            state.files.push(fileItem);
            
            const li = document.createElement('li');
            li.className = 't-upload__file-item t-border-box--inset-sm';
            li.dataset.fileId = fileId;
            li.innerHTML = `
                <span class="t-upload__file-name">${file.name}</span>
                <span class="t-upload__file-size">${window.formatFileSize(file.size)}</span>
                <span class="t-upload__file-status">待上传</span>
                <div class="t-upload__file-progress">
                    <div class="t-upload__file-progress-bar" style="width: 0%"></div>
                </div>
                <button class="t-upload__file-remove" onclick="removeFileItem('${uploadId}', '${fileId}')">
                    <i class="t-icon-close"></i>
                </button>
            `;
            list.appendChild(li);
        });
    };

    /**
     * 移除文件项
     * @param {string} uploadId - 上传组件ID
     * @param {string} fileId - 文件ID
     */
    window.removeFileItem = function(uploadId, fileId) {
        const state = window.uploadStates[uploadId];
        if (!state) return;
        
        const index = state.files.findIndex(f => f.id === fileId);
        if (index > -1) {
            state.files.splice(index, 1);
        }
        
        const list = document.getElementById(uploadId + '-list');
        const item = list.querySelector(`[data-file-id="${fileId}"]`);
        if (item) {
            item.remove();
        }
    };

    /**
     * 带进度的模拟上传
     * @param {string} uploadId - 上传组件ID
     */
    window.simulateUploadWithProgress = function(uploadId) {
        const state = window.uploadStates[uploadId];
        if (!state || state.files.length === 0) {
            if (window.showMessage) {
                window.showMessage({
                    type: 'warning',
                    message: '请先选择文件',
                    duration: 2000
                });
            }
            return;
        }
        
        let completedCount = 0;
        
        state.files.forEach(fileItem => {
            if (fileItem.status !== 'ready') {
                completedCount++;
                return;
            }
            
            fileItem.status = 'uploading';
            window.updateFileItemStatus(uploadId, fileItem.id, 'uploading');
            
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    fileItem.status = Math.random() > 0.1 ? 'success' : 'error'; // 90%成功率
                    window.updateFileItemStatus(uploadId, fileItem.id, fileItem.status);
                    window.updateFileItemProgress(uploadId, fileItem.id, 100);
                    
                    completedCount++;
                    if (completedCount >= state.files.length) {
                        const successCount = state.files.filter(f => f.status === 'success').length;
                        if (window.showMessage) {
                            window.showMessage({
                                type: successCount > 0 ? 'success' : 'error',
                                message: `上传完成：${successCount}/${state.files.length} 个文件上传成功`,
                                duration: 3000
                            });
                        }
                    }
                } else {
                    window.updateFileItemProgress(uploadId, fileItem.id, progress);
                }
            }, 300);
        });
    };

    /**
     * 更新文件项状态
     * @param {string} uploadId - 上传组件ID
     * @param {string} fileId - 文件ID
     * @param {string} status - 状态
     */
    window.updateFileItemStatus = function(uploadId, fileId, status) {
        const list = document.getElementById(uploadId + '-list');
        const item = list.querySelector(`[data-file-id="${fileId}"]`);
        if (!item) return;
        
        const statusEl = item.querySelector('.t-upload__file-status');
        const statusText = {
            'ready': '待上传',
            'uploading': '上传中',
            'success': '上传成功',
            'error': '上传失败'
        };
        if (statusEl) {
            statusEl.textContent = statusText[status] || status;
            statusEl.className = 't-upload__file-status is-' + status;
        }
    };

    /**
     * 更新文件项进度
     * @param {string} uploadId - 上传组件ID
     * @param {string} fileId - 文件ID
     * @param {number} progress - 进度
     */
    window.updateFileItemProgress = function(uploadId, fileId, progress) {
        const list = document.getElementById(uploadId + '-list');
        const item = list.querySelector(`[data-file-id="${fileId}"]`);
        if (!item) return;
        
        const progressBar = item.querySelector('.t-upload__file-progress-bar');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    };

    /**
     * 清空上传
     * @param {string} uploadId - 上传组件ID
     */
    window.clearUpload = function(uploadId) {
        window.uploadStates[uploadId] = { files: [] };
        const list = document.getElementById(uploadId + '-list');
        if (list) {
            list.innerHTML = '';
        }
    };

    /**
     * 多文件选择处理
     * @param {string} uploadId - 上传组件ID
     * @param {FileList} files - 文件列表
     */
    window.handleMultiFileSelect = function(uploadId, files) {
        if (!window.uploadStates[uploadId]) {
            window.uploadStates[uploadId] = { files: [] };
        }
        
        const state = window.uploadStates[uploadId];
        const table = document.getElementById(uploadId + '-table');
        const tbody = table.querySelector('tbody');
        const empty = document.getElementById(uploadId + '-empty');
        
        table.style.display = 'block';//table
        empty.style.display = 'none';
        
        Array.from(files).forEach(file => {
            const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            const fileItem = {
                id: fileId,
                file: file,
                name: file.name,
                size: file.size,
                status: 'ready'
            };
            
            state.files.push(fileItem);
            
            const tr = document.createElement('tr');
            tr.dataset.fileId = fileId;
            tr.innerHTML = `
                <td>${file.name}</td>
                <td>${window.formatFileSize(file.size)}</td>
                <td><span class="t-tag">待上传</span></td>
                <td>
                    <button class="t-btn t-btn--text" onclick="removeTableFile('${uploadId}', '${fileId}')">
                        <i class="t-icon-delete"></i> 删除
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    };

    /**
     * 删除表格中的文件
     * @param {string} uploadId - 上传组件ID
     * @param {string} fileId - 文件ID
     */
    window.removeTableFile = function(uploadId, fileId) {
        const state = window.uploadStates[uploadId];
        if (!state) return;
        
        const index = state.files.findIndex(f => f.id === fileId);
        if (index > -1) {
            state.files.splice(index, 1);
        }
        
        const table = document.getElementById(uploadId + '-table');
        const tbody = table.querySelector('tbody');
        const row = tbody.querySelector(`[data-file-id="${fileId}"]`);
        if (row) {
            row.remove();
        }
        
        if (state.files.length === 0) {
            table.style.display = 'none';
            document.getElementById(uploadId + '-empty').style.display = 'block';
        }
    };

    /**
     * 展开/收起表格行
     * @param {HTMLElement} icon - 展开图标元素
     */
    window.toggleExpandRow = function(icon) {
        const row = icon.closest('tr');
        if (!row) return;
        const expandedRow = row.nextElementSibling;
        if (expandedRow && expandedRow.classList.contains('t-table__expanded-row')) {
            const isExpanded = expandedRow.style.display !== 'none';
            expandedRow.style.display = isExpanded ? 'none' : 'table-row';
            icon.textContent = isExpanded ? '▶' : '▼';
            icon.classList.toggle('expanded', !isExpanded);
        }
    };

    /**
     * 展开/收起树形表格节点
     * @param {HTMLElement} icon - 树形图标元素
     */
    window.toggleTreeRow = function(icon) {
        const row = icon.closest('tr');
        if (!row) return;
        const isExpanded = icon.textContent === '▼';
        icon.textContent = isExpanded ? '▶' : '▼';
        
        // 找到所有子行并切换显示
        let nextRow = row.nextElementSibling;
        while (nextRow && nextRow.classList.contains('t-table__tree-child')) {
            nextRow.style.display = isExpanded ? 'none' : 'table-row';
            nextRow = nextRow.nextElementSibling;
        }
    };

    return {
        version: '1.1.0',
        // 组件
        Radio,
        Checkbox,
        Input,
        InputNumber,
        Select,
        Dropdown,
        Dialog,
        Tooltip,
        Steps,
        Message,
        Alert,
        Notification,
        MessageBox,
        NavMenu,
        Backtop,
        Theme,
        Switch,
        Slider,
        Rate,
        Loading,
        Collapse,
        Countdown,
        ColorPicker,
        Cascader,
        TimePicker,
        DatePicker,
        DateTimePicker,
        Upload,
        Form,
        Transfer,
        Popover,
        Tabs,
        Image,
        Carousel,
        Tag,
        Avatar,
        Drawer,
        Tree,
        Pagination,
        // 工具函数
        utils: {
            debounce,
            throttle,
            isInViewport
        },
        // 初始化
        init
    };
    
}));
