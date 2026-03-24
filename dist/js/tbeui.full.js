/**
 * TBE UI JS v1.0.0
 * 构建时间: 2026-03-24T11:42:24.200Z
 * 官网: https://ui.bitehe.com
 */



(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' 
        ? module.exports = factory() 
        : typeof define === 'function' && define.amd 
        ? define(factory) 
        : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.TbeUI = factory());
}(this, function () {
    'use strict';

    
    
    
    function debounce(fn, delay) {
        let timer = null;
        return function (...args) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        };
    }

    
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

    
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }


    
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
    
    
    
    const Radio = {
        
        selectRadioButton(button, groupName) {
            this.selectButton(button, groupName);
        },

        
        selectButton(button, groupName) {
            const group = button.parentElement;
            const buttons = group.querySelectorAll('.t-radio-button');
            
            buttons.forEach(btn => {
                btn.classList.remove('is-active');
                btn.setAttribute('aria-checked', 'false');
            });
            
            button.classList.add('is-active');
            button.setAttribute('aria-checked', 'true');
            
            
            button.dispatchEvent(new CustomEvent('t:radio:change', {
                detail: { value: button.dataset.value, group: groupName }
            }));
        },

        
        updateCheckedState(radio) {
            const parent = radio.closest('.t-radio');
            if (parent) {
                const isChecked = radio.checked;
                parent.classList.toggle('is-checked', isChecked);
                parent.setAttribute('aria-checked', isChecked.toString());
                
                
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

    
    
    const Checkbox = {
        
        updateCheckedState(checkbox) {
            const parent = checkbox.closest('.t-checkbox');
            if (parent && !parent.classList.contains('is-disabled')) {
                const isChecked = checkbox.checked;
                parent.classList.toggle('is-checked', isChecked);
                parent.setAttribute('aria-checked', isChecked.toString());
            }
        },

        
        toggleCheckboxButton(button) {
            this.toggleButton(button);
        },

        
        toggleButton(button) {
            if (button.classList.contains('is-disabled')) return;
            const isActive = button.classList.toggle('is-active');
            button.setAttribute('aria-pressed', isActive.toString());
        },

        
        toggleCheckAll() {
            
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
            
            
            const allCheckboxEl = document.querySelector('.t-checkbox.is-indeterminate, .t-checkbox[data-check-all]');
            if (allCheckboxEl) {
                const group = allCheckboxEl.closest('.t-checkbox-group');
                if (group) {
                    this.toggleCheckAllBySelector('#' + group.id);
                }
            }
        },

        
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

        
        init() {
            document.querySelectorAll('.t-checkbox__input').forEach(checkbox => {
                this.updateCheckedState(checkbox);
                
                checkbox.addEventListener('change', () => {
                    this.updateCheckedState(checkbox);
                    
                    
                    const group = checkbox.closest('[data-checkbox-group]');
                    if (group) {
                        this.updateCheckAllState(`[data-checkbox-group="${group.dataset.checkboxGroup}"]`);
                    }
                });
            });
        }
    };

    

    const Input = {
        
        clearInput(inputId) {
            this.clear(inputId);
        },

        
        clear(inputId) {
            const input = document.getElementById(inputId);
            if (input) {
                input.value = '';
                input.focus();
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        },

        
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

        
        autoResize(textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        },

        
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

    

    const InputNumber = {
        
        changeNumber(inputId, delta) {
            this.change(inputId, delta);
        },

        
        changeNumberStep(inputId, delta, step) {
            const input = document.getElementById(inputId);
            if (input) {
                input.step = step;
            }
            this.change(inputId, delta);
        },

        
        changeNumberStrict(inputId, delta, step) {
            const input = document.getElementById(inputId);
            if (input) {
                input.step = step;
            }
            this.change(inputId, delta, { strict: true });
        },

        
        change(inputId, delta, options = {}) {
            const input = document.getElementById(inputId);
            if (!input) return;

            let value = parseFloat(input.value) || 0;
            const min = parseFloat(input.min);
            const max = parseFloat(input.max);
            const step = parseFloat(input.step) || 1;

            value += delta * step;

            
            if (!isNaN(min) && value < min) value = min;
            if (!isNaN(max) && value > max) value = max;

            
            if (options.strict && value % step !== 0) {
                value = Math.round(value / step) * step;
            }

            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    };

    

    const Select = {
        
        toggleSelect(selectId) {
            this.toggle(selectId);
        },

        
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

            
            select.querySelectorAll('.t-select__option').forEach(option => {
                option.classList.remove('is-selected');
                option.setAttribute('aria-selected', 'false');
            });

            
            select.dispatchEvent(new CustomEvent('t:select:clear'));
        },

        
        toggle(selectId) {
            const select = document.getElementById(selectId);
            if (!select || select.classList.contains('is-disabled')) return;

            const isOpen = select.classList.contains('is-open');

            
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

        
        selectOption(selectId, value, label) {
            const select = document.getElementById(selectId);
            if (!select) return;

            const input = select.querySelector('.t-select__input');
            const displayLabel = label || value;

            if (input) {
                input.value = displayLabel;
                input.setAttribute('data-value', value);
            }

            
            select.querySelectorAll('.t-select__option').forEach(option => {
                const isSelected = option.dataset.value === value || option.textContent === displayLabel;
                option.classList.toggle('is-selected', isSelected);
                option.setAttribute('aria-selected', isSelected.toString());
            });

            select.classList.remove('is-open');
            select.setAttribute('aria-expanded', 'false');

            
            select.dispatchEvent(new CustomEvent('t:select:change', {
                detail: { value, label: displayLabel }
            }));
        }
    };

    
    
    const Dropdown = {
        
        toggle(dropdownId) {
            const dropdown = document.getElementById(dropdownId);
            if (dropdown) {
                const isActive = dropdown.classList.toggle('is-active');
                dropdown.setAttribute('aria-expanded', isActive.toString());
            }
        },

        
        selectItem(item, value) {
            const dropdown = item.closest('.t-dropdown');
            if (dropdown) {
                dropdown.classList.remove('is-active');
                dropdown.setAttribute('aria-expanded', 'false');
            }
            
            Message.success('选择了：' + value);
            
            
            if (dropdown) {
                dropdown.dispatchEvent(new CustomEvent('t:dropdown:select', {
                    detail: { value }
                }));
            }
        },

        
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

    

    const Dialog = {
        stack: [],
        dragState: {},

        
        open(dialogId, options = {}) {
            const dialog = document.getElementById(dialogId);
            if (!dialog) return;

            dialog.style.display = 'flex';
            dialog.setAttribute('aria-hidden', 'false');

            
            if (this.stack.length === 0) {
                document.body.style.overflow = 'hidden';
            }

            this.stack.push(dialogId);

            
            const draggableDialog = dialog.querySelector('.t-dialog--draggable');
            if (draggableDialog) {
                this.initDraggable(draggableDialog);
            }

            
            const focusable = dialog.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusable) focusable.focus();

            
            dialog.dispatchEvent(new CustomEvent('t:dialog:open', {
                detail: { dialogId, options }
            }));
        },

        
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

        
        handleDragEnd: () => {
            Dialog.dragState = {};
            document.removeEventListener('mousemove', Dialog.handleDragMove);
            document.removeEventListener('mouseup', Dialog.handleDragEnd);
        },

        
        close(dialogId) {
            const dialog = document.getElementById(dialogId);
            if (!dialog) return;
            
            dialog.style.display = 'none';
            dialog.setAttribute('aria-hidden', 'true');
            
            const index = this.stack.indexOf(dialogId);
            if (index > -1) {
                this.stack.splice(index, 1);
            }
            
            
            if (this.stack.length === 0) {
                document.body.style.overflow = '';
            }
            
            
            dialog.dispatchEvent(new CustomEvent('t:dialog:close', {
                detail: { dialogId }
            }));
        },

        
        init() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.stack.length > 0) {
                    const topDialog = this.stack[this.stack.length - 1];
                    this.close(topDialog);
                }
            });
        }
    };

    

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

        
        success(message, title) {
            return this.alert(message, title, { type: 'success' });
        },

        
        warning(message, title) {
            return this.alert(message, title, { type: 'warning' });
        },

        
        error(message, title) {
            return this.alert(message, title, { type: 'error' });
        },

        
        info(message, title) {
            return this.alert(message, title, { type: 'info' });
        },

        
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

    
    
    const Tooltip = {
        
        show(tooltipId) {
            const tooltip = document.getElementById(tooltipId);
            if (tooltip) {
                tooltip.classList.add('is-active');
                tooltip.setAttribute('aria-hidden', 'false');
            }
        },

        
        hide(tooltipId) {
            const tooltip = document.getElementById(tooltipId);
            if (tooltip) {
                tooltip.classList.remove('is-active');
                tooltip.setAttribute('aria-hidden', 'true');
            }
        },

        
        toggle(tooltipId) {
            const tooltip = document.getElementById(tooltipId);
            if (tooltip) {
                const isActive = tooltip.classList.toggle('is-active');
                tooltip.setAttribute('aria-hidden', (!isActive).toString());
            }
        }
    };

    
    
    const Steps = {
        
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

    
    
    const Message = {
        container: null,
        
        
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
            
            
            requestAnimationFrame(() => {
                el.classList.add('show');
                
                
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
            
            
            if (showClose) {
                el.querySelector('.t-message-close').addEventListener('click', () => {
                    this.close(el);
                });
            }
            
            
            if (duration > 0) {
                setTimeout(() => {
                    this.close(el);
                }, duration);
            }
            
            return el;
        },

        
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

        
        closeAll() {
            if (this.container) {
                const messages = Array.from(this.container.children);
                messages.forEach(msg => this.close(msg));
            }
        },

        
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        
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

    
    
    const Alert = {
        container: null,
        idCounter: 0,
        overlay: null, 

        
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

        
        getOverlay() {
            if (!this.overlay) {
                this.overlay = document.createElement('div');
                this.overlay.className = 't-alert-overlay';
                document.body.appendChild(this.overlay);
            }
            return this.overlay;
        },

        
        showOverlay() {
            const overlay = this.getOverlay();
            overlay.style.display = 'block';
            requestAnimationFrame(() => {
                overlay.classList.add('show');
            });
        },

        
        hideOverlay() {
            const overlay = this.getOverlay();
            overlay.classList.remove('show');
            setTimeout(() => {
                if (this.container && this.container.children.length === 0) {
                    overlay.style.display = 'none';
                }
            }, 300);
        },

        
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
                duration = 3000, 
                showProgress = true, 
                showConfirm = false,
                collapsible = false,
                defaultExpanded = true,
                overlay = false, 
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
            alert.style.position = 'relative'; 
            alert.style.zIndex = '9999'; 

            
            if (overlay) {
                this.showOverlay();
            }

            const iconHtml = (type && showIcon) ? `<div class="t-alert-icon">${icons[type] || ''}</div>` : '';

            const closeHtml = (closable && showClose) ?
                `<button class="t-alert-close" onclick="TbeUI.Alert.close('${id}')" ${closeText ? 'style="width: auto; padding: 0 12px; border-radius: 12px;"' : ''}>${closeText || '×'}</button>` : '';

            
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

            
            let actionsHtml = '';
            if (showConfirm) {
                actionsHtml = `
                    <div class="t-alert-actions">
                        <button class="t-alert-action-btn" onclick="TbeUI.Alert.close('${id}'); ${onCancel ? `(${onCancel.toString()})()` : ''}">取消</button>
                        <button class="t-alert-action-btn primary" onclick="TbeUI.Alert.close('${id}'); ${onConfirm ? `(${onConfirm.toString()})()` : ''}">确认</button>
                    </div>
                `;
            }

            
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

            
            requestAnimationFrame(() => {
                alert.classList.add('show');
                
                
                if (showProgress && duration > 0) {
                    const progressBar = document.getElementById(`${id}-progress`);
                    if (progressBar) {
                        progressBar.style.transition = `transform ${duration}ms linear`;
                        progressBar.style.transform = 'scaleX(0)';
                    }
                }
            });

            
            if (duration > 0) {
                setTimeout(() => {
                    this.close(id);
                }, duration);
            }

            return id;
        },

        
        close(id) {
            const alert = document.getElementById(id);
            if (!alert) return;

            alert.classList.remove('show');

            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
                
                
                if (this.container && this.container.children.length === 0) {
                    this.hideOverlay();
                }
            }, 300);
        },

        
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

        
        closeAll() {
            document.querySelectorAll('.t-alert').forEach(alert => {
                this.close(alert.id);
            });
        },

        
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        
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

    
    
    const Notification = {
        container: null,
        idCounter: 0,

        
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
            
            
            const messageContent = dangerouslyUseHTMLString ? message : this.escapeHtml(message);
            const titleContent = dangerouslyUseHTMLString ? title : this.escapeHtml(title);
            
            
            let iconHtml = '';
            if (icon) {
                
                iconHtml = `<div class="t-notification-icon">${icon}</div>`;
            } else {
                iconHtml = `<div class="t-notification-icon">${iconMap[type] || iconMap.info}</div>`;
            }

            
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

            
            if (showClose) {
                const closeBtn = el.querySelector('.t-notification-close');
                closeBtn.addEventListener('click', () => {
                    this.close(id);
                });
            }

            
            if (options.actions && options.actions.length > 0) {
                const actionBtns = el.querySelectorAll('.t-notification-action-btn');
                actionBtns.forEach((btn, index) => {
                    btn.addEventListener('click', () => {
                        const action = options.actions[index];
                        if (action && typeof action.callback === 'function') {
                            action.callback();
                        }
                        
                        this.close(id);
                    });
                });
            }
            
            container.appendChild(el);
            
            
            requestAnimationFrame(() => {
                el.classList.add('show');

                
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
            
            
            if (duration > 0) {
                setTimeout(() => {
                    this.close(id);
                }, duration);
            }
            
            return id;
        },

        
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        
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

    
    
    const NavMenu = {
        activeMenu: null,
        
        
        init(selector = '.t-nav-menu', options = {}) {
            const menus = document.querySelectorAll(selector);
            
            menus.forEach(menu => {
                
                menu.querySelectorAll('.t-nav-submenu > .t-nav-menu-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        if (options.accordion !== false) {
                            
                            const siblings = item.parentElement.parentElement.querySelectorAll('.t-nav-submenu.is-opened');
                            siblings.forEach(submenu => {
                                if (submenu !== item.parentElement) {
                                    submenu.classList.remove('is-opened');
                                }
                            });
                        }
                        
                        item.parentElement.classList.toggle('is-opened');
                        
                        
                        menu.dispatchEvent(new CustomEvent('t:navmenu:toggle', {
                            detail: { item, isOpen: item.parentElement.classList.contains('is-opened') }
                        }));
                    });
                });
                
                
                menu.querySelectorAll('.t-nav-menu-item:not(.t-nav-submenu > .t-nav-menu-item)').forEach(item => {
                    item.addEventListener('click', (e) => {
                        
                        menu.querySelectorAll('.t-nav-menu-item.active').forEach(activeItem => {
                            if (activeItem !== item) {
                                activeItem.classList.remove('active');
                            }
                        });
                        
                        
                        item.classList.add('active');
                        
                        
                        menu.dispatchEvent(new CustomEvent('t:navmenu:select', {
                            detail: { item, index: Array.from(menu.querySelectorAll('.t-nav-menu-item')).indexOf(item) }
                        }));
                    });
                });
            });
            
            return this;
        },
        
        
        openSubmenu(submenu) {
            if (submenu && submenu.classList.contains('t-nav-submenu')) {
                submenu.classList.add('is-opened');
            }
        },
        
        
        closeSubmenu(submenu) {
            if (submenu && submenu.classList.contains('t-nav-submenu')) {
                submenu.classList.remove('is-opened');
            }
        },
        
        
        collapse(selector = '.t-nav-menu') {
            const menu = document.querySelector(selector);
            if (menu) {
                menu.classList.add('t-nav-menu--collapsed');
            }
        },
        
        
        expand(selector = '.t-nav-menu') {
            const menu = document.querySelector(selector);
            if (menu) {
                menu.classList.remove('t-nav-menu--collapsed');
            }
        },
        
        
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
        
        
        toggleMobileSidebar(sidebarSelector = '.sidebar', overlaySelector = '.sidebar-overlay') {
            const sidebar = document.querySelector(sidebarSelector);
            if (sidebar && sidebar.classList.contains('active')) {
                this.closeMobileSidebar(sidebarSelector, overlaySelector);
            } else {
                this.openMobileSidebar(sidebarSelector, overlaySelector);
            }
        }
    };
    
    
    
    const Backtop = {
        instances: new Map(),
        
        
        init(selector = '.t-backtop', options = {}) {
            const buttons = document.querySelectorAll(selector);
            
            buttons.forEach(button => {
                const config = {
                    visibilityOffset: 200,
                    scrollDuration: 300,
                    target: null,
                    ...options
                };
                
                
                let scrollTarget;
                const targetId = button.getAttribute('data-target');
                
                if (targetId) {
                    scrollTarget = document.getElementById(targetId);
                } else if (config.target) {
                    scrollTarget = typeof config.target === 'string' 
                        ? document.querySelector(config.target) 
                        : config.target;
                }
                
                
                if (!scrollTarget) {
                    scrollTarget = window;
                }
                
                this.instances.set(button, { scrollTarget, config });
                
                
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.scrollToTop(button);
                });
                
                
                const scrollHandler = throttle(() => {
                    this.updateVisibility(button);
                }, 100);
                
                if (scrollTarget === window) {
                    window.addEventListener('scroll', scrollHandler);
                } else {
                    scrollTarget.addEventListener('scroll', scrollHandler);
                }
                
                
                this.updateVisibility(button);
            });
            
            return this;
        },
        
        
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
            
            
            button.dispatchEvent(new CustomEvent('t:backtop:click'));
        },
        
        
        destroy(selector = '.t-backtop') {
            document.querySelectorAll(selector).forEach(button => {
                this.instances.delete(button);
            });
        }
    };
    
    

    const Switch = {
        
        toggleSwitch(switchId) {
            this.toggle(switchId);
        },

        
        toggle(switchId) {
            const switchEl = document.getElementById(switchId);
            if (!switchEl || switchEl.classList.contains('is-disabled')) return;

            const input = switchEl.querySelector('.t-switch__input');
            if (input) {
                input.checked = !input.checked;
                switchEl.classList.toggle('is-checked', input.checked);
                switchEl.setAttribute('aria-checked', input.checked.toString());

                
                switchEl.dispatchEvent(new CustomEvent('t:switch:change', {
                    detail: { checked: input.checked }
                }));

                
                const valueDisplay = document.getElementById(switchId + '-value');
                if (valueDisplay) {
                    valueDisplay.textContent = '当前值: ' + input.checked;
                }
            }
        },

        
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

    

    const Slider = {
        
        clickSlider(event, sliderId) {
            this.click(event, sliderId);
        },

        
        startDragSlider(event, sliderId, buttonIdx = 0) {
            
            if (typeof buttonIdx === 'string') {
                buttonIdx = parseInt(buttonIdx, 10) || 0;
            }
            
            const slider = document.getElementById(sliderId);
            if (!slider) return;
            const buttons = slider.querySelectorAll('.t-slider__button-wrapper');
            const button = buttons[buttonIdx];
            if (button) {
                
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

        
        updateValue(sliderId, percent, buttonIdx = 0) {
            const slider = document.getElementById(sliderId);
            if (!slider) return;
            
            const runway = slider.querySelector('.t-slider__runway');
            const bar = slider.querySelector('.t-slider__bar');
            const buttons = slider.querySelectorAll('.t-slider__button-wrapper');
            
            if (runway && bar && buttons[buttonIdx]) {
                const button = buttons[buttonIdx];
                button.style.left = percent + '%';
                
                
                const tooltip = button.querySelector('.t-slider__tooltip');
                if (tooltip) {
                    tooltip.textContent = Math.round(percent) + '%';
                }
                
                
                const valueDisplay = slider.querySelector('.t-slider__value');
                if (valueDisplay) {
                    valueDisplay.textContent = Math.round(percent);
                }
                
                
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
                
                
                slider.dispatchEvent(new CustomEvent('t:slider:change', {
                    detail: { value: percent, buttonIndex: buttonIdx }
                }));
            }
        },

        
        click(event, sliderId) {
            const slider = document.getElementById(sliderId);
            if (!slider) return;
            
            const runway = slider.querySelector('.t-slider__runway');
            if (!runway) return;
            
            const rect = runway.getBoundingClientRect();
            let percent = ((event.clientX - rect.left) / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent));
            
            
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
                
                
                if (slider.classList.contains('is-range') && buttons.length >= 2) {
                    const otherButtonIdx = buttonIdx === 0 ? 1 : 0;
                    const otherButton = buttons[otherButtonIdx];
                    const otherPercent = parseFloat(otherButton.style.left);
                    
                    if (buttonIdx === 0) {
                        
                        percent = Math.min(percent, otherPercent - 1);
                    } else {
                        
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

    

    const Rate = {
        
        states: {},

        
        setRate(rateId, value) {
            this.set(rateId, value);
        },

        
        hoverRate(rateId, value) {
            this.hover(rateId, value);
        },

        
        leaveRate(rateId) {
            this.leave(rateId);
        },

        
        set(rateId, value) {
            const rate = document.getElementById(rateId);
            if (!rate) return;

            
            if (!this.states[rateId]) {
                this.states[rateId] = { value: 0 };
            }

            this.states[rateId].value = value;

            
            const stars = rate.querySelectorAll('.t-rate-star, .t-rate__star');
            stars.forEach((star, index) => {
                if (index < value) {
                    star.classList.add('active', 'is-active');
                } else {
                    star.classList.remove('active', 'is-active');
                }
            });

            
            const textEl = document.getElementById(rateId + '-text');
            if (textEl) {
                const texts = ['很差', '较差', '一般', '满意', '非常满意'];
                textEl.textContent = texts[value - 1] || '';
            }

            
            const scoreEl = document.getElementById(rateId + '-score');
            if (scoreEl) {
                scoreEl.textContent = value + ' 分';
            }

            
            rate.dispatchEvent(new CustomEvent('t:rate:change', {
                detail: { value }
            }));
        },

        
        hover(rateId, value) {
            const rate = document.getElementById(rateId);
            if (!rate) return;

            
            const stars = rate.querySelectorAll('.t-rate-star, .t-rate__star');
            stars.forEach((star, index) => {
                if (index < value) {
                    star.classList.add('hover', 'is-hover');
                } else {
                    star.classList.remove('hover', 'is-hover');
                }
            });

            
            const textEl = document.getElementById(rateId + '-text');
            if (textEl) {
                const texts = ['很差', '较差', '一般', '满意', '非常满意'];
                textEl.textContent = texts[value - 1] || '';
            }
        },

        
        leave(rateId) {
            const rate = document.getElementById(rateId);
            if (!rate) return;

            
            const stars = rate.querySelectorAll('.t-rate-star, .t-rate__star');
            stars.forEach(star => {
                star.classList.remove('hover', 'is-hover');
            });

            
            const state = this.states[rateId];
            if (state) {
                this.set(rateId, state.value);
            }
        }
    };

    
    
    const Loading = {
        
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

        
        close(loadingEl) {
            if (loadingEl && loadingEl.parentNode) {
                loadingEl.parentNode.removeChild(loadingEl);
            }
        },

        
        fullscreen(options = {}) {
            const loadingEl = this.show(null, { ...options, fullscreen: true });
            return {
                close: () => this.close(loadingEl)
            };
        },

        
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

        
        init() {
            
        }
    };

    
    
    const Collapse = {
        
        toggle(header) {
            const item = header.closest('.t-collapse-item');
            if (!item) return;
            
            
            if (item.classList.contains('t-collapse-item--disabled')) {
                return;
            }
            
            
            const collapse = item.parentElement;
            
            
            const isAccordion = !collapse.classList.contains('t-collapse--multiple');
            
            
            const isActive = item.classList.contains('active');
            
            
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
            
            
            item.classList.toggle('active');
            
            
            const content = item.querySelector('.t-collapse-content') || 
                           item.querySelector('.t-collapse-item__content') ||
                           item.querySelector('.t-collapse-body');
            
            
            const arrow = item.querySelector('.t-collapse-arrow');
            
            if (content) {
                const isNowActive = item.classList.contains('active');
                if (isNowActive) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = '0';
                }
            }
            
            
            if (arrow) {
                const isNowActive = item.classList.contains('active');
                arrow.style.transform = isNowActive ? 'rotate(90deg)' : 'rotate(0deg)';
            }
            
            
            header.setAttribute('aria-expanded', item.classList.contains('active').toString());
            
            
            item.dispatchEvent(new CustomEvent('t:collapse:change', {
                detail: { isActive: item.classList.contains('active') }
            }));
        },

        
        init() {
            
            document.querySelectorAll('.t-collapse').forEach(collapse => {
                
                const headers = collapse.querySelectorAll('.t-collapse-header, .t-collapse-item__header');
                headers.forEach(header => {
                    
                    if (!header.getAttribute('onclick')) {
                        header.addEventListener('click', function(e) {
                            
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

    
    
    const Countdown = {
        timers: {},

        
        start(id, endTime, format = 'HH:mm:ss') {
            const el = document.getElementById(id);
            if (!el) return;
            
            
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

        
        stop(id) {
            if (this.timers[id]) {
                clearInterval(this.timers[id]);
                delete this.timers[id];
            }
        }
    };

    

    const ColorPicker = {
        
        states: {},

        
        toggleColorPicker(pickerId, event) {
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            this.toggle(pickerId);
        },

        
        selectPredefineColor(pickerId, color, event) {
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            this.setColor(pickerId, color);
        },

        
        confirmColor(pickerId) {
            this.close(pickerId);
        },

        
        open(pickerId) {
            const picker = document.getElementById(pickerId);
            if (picker) {
                picker.classList.add('active');
                picker.setAttribute('aria-hidden', 'false');
                this.initEvents(pickerId);
            }
        },

        
        close(pickerId) {
            const picker = document.getElementById(pickerId);
            if (picker) {
                picker.classList.remove('active');
            }
        },

        
        toggle(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;

            const isOpen = picker.classList.contains('active');

            
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

        
        initEvents(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;

            
            if (!this.states[pickerId]) {
                
                const alphaSlider = picker.querySelector('.t-color-alpha-slider');
                this.states[pickerId] = {
                    hue: 210,
                    saturation: 100,
                    value: 100,
                    alpha: alphaSlider ? 0.6 : 1
                };
            }

            
            this.updateSaturationBackground(pickerId);
            
            
            this.updateCursors(pickerId);

            
            const saturation = picker.querySelector('.t-color-saturation');
            if (saturation) {
                saturation.addEventListener('click', (e) => this.handleSaturationClick(pickerId, e));
                saturation.addEventListener('mousedown', (e) => this.startSaturationDrag(pickerId, e));
            }

            
            const hueSlider = picker.querySelector('.t-color-hue-slider');
            if (hueSlider) {
                hueSlider.addEventListener('click', (e) => this.handleHueClick(pickerId, e));
                hueSlider.addEventListener('mousedown', (e) => this.startHueDrag(pickerId, e));
            }

            
            const alphaSlider = picker.querySelector('.t-color-alpha-slider');
            if (alphaSlider) {
                alphaSlider.addEventListener('click', (e) => this.handleAlphaClick(pickerId, e));
                alphaSlider.addEventListener('mousedown', (e) => this.startAlphaDrag(pickerId, e));
            }
        },

        
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

        
        handleAlphaClick(pickerId, event) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;
            
            const alphaSlider = picker.querySelector('.t-color-alpha-slider');
            if (!alphaSlider) return;
            
            const rect = alphaSlider.getBoundingClientRect();
            let x = event.clientX - rect.left;
            
            
            x = Math.max(0, Math.min(x, rect.width-2));
            
            
            let alpha = Math.round((x / rect.width) * 10) / 10;
            
            alpha = Math.max(0.1, Math.min(0.9, alpha));
            
            this.updateColor(pickerId, {
                alpha: alpha
            });
        },

        
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

        
        updateColor(pickerId, changes) {
            const state = this.states[pickerId];
            if (!state) return;
            
            
            if (changes.hue !== undefined) state.hue = Math.max(0, Math.min(360, changes.hue));
            if (changes.saturation !== undefined) state.saturation = Math.max(0, Math.min(100, changes.saturation));
            if (changes.value !== undefined) state.value = Math.max(0, Math.min(100, changes.value));
            if (changes.alpha !== undefined) {
                
                let alpha = Math.round(changes.alpha * 10) / 10;
                
                state.alpha = Math.max(0.1, Math.min(0.9, alpha));
            }
            
            
            const color = this.hsvToRgb(state.hue, state.saturation, state.value);
            const rgbaColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${state.alpha})`;
            const hexColor = this.rgbToHex(color.r, color.g, color.b);
            
            
            this.setColor(pickerId, state.alpha < 1 ? rgbaColor : hexColor);
            
            
            this.updateSaturationBackground(pickerId);
            
            
            this.updateCursors(pickerId);
        },

        
        updateSaturationBackground(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;
            
            const state = this.states[pickerId];
            if (!state) return;
            
            
            const hueColor = this.hsvToRgb(state.hue, 100, 100);
            const hexColor = this.rgbToHex(hueColor.r, hueColor.g, hueColor.b);
            
            
            const saturation = picker.querySelector('.t-color-saturation');
            if (saturation) {
                saturation.style.background = `linear-gradient(to right, white, ${hexColor}), linear-gradient(to top, black, transparent)`;
                saturation.style.backgroundBlendMode = 'multiply';
            }
            
            
            const alphaBg = picker.querySelector('.t-color-alpha-bg');
            if (alphaBg) {
                alphaBg.style.backgroundImage = `linear-gradient(to right, rgba(${hueColor.r}, ${hueColor.g}, ${hueColor.b}, 0.2), rgba(${hueColor.r}, ${hueColor.g}, ${hueColor.b}, 0.8))`;
            }
        },

        
        updateCursors(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;
            
            const state = this.states[pickerId];
            if (!state) return;
            
            
            const saturation = picker.querySelector('.t-color-saturation');
            const cursor = picker.querySelector('.t-color-cursor');
            if (saturation && cursor) {
                const rect = saturation.getBoundingClientRect();
                cursor.style.left = (state.saturation / 100) * rect.width + 'px';
                cursor.style.top = (1 - state.value / 100) * rect.height + 'px';
            }
            
            
            const hueSlider = picker.querySelector('.t-color-hue-slider');
            const hueThumb = picker.querySelector('.t-color-hue-thumb');
            if (hueSlider && hueThumb) {
                const rect = hueSlider.getBoundingClientRect();
                hueThumb.style.top = (state.hue / 360) * rect.height + 'px';
            }
            
            
            const alphaSlider = picker.querySelector('.t-color-alpha-slider');
            const alphaThumb = picker.querySelector('.t-color-alpha-thumb');
            if (alphaSlider && alphaThumb) {
                const rect = alphaSlider.getBoundingClientRect();
                
                const minAlpha = 0.1;
                const maxAlpha = 0.9;
                const normalizedAlpha = (state.alpha - minAlpha) / (maxAlpha - minAlpha);
                const left = normalizedAlpha * (rect.width - 14) + 3;
                alphaThumb.style.left = left + 'px';
            }
        },

        
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

        
        rgbToHex(r, g, b) {
            return '#' + [r, g, b].map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
        },

        
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

    
    
    const Theme = {
        current: 'light',

        
        set(theme) {
            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
                this.current = 'dark';
            } else {
                document.documentElement.removeAttribute('data-theme');
                this.current = 'light';
            }
            
            
            try {
                localStorage.setItem('tbeui-theme', theme);
            } catch (e) {
                
            }
            
            
            document.dispatchEvent(new CustomEvent('tbeui:theme:change', {
                detail: { theme }
            }));
        },

        
        toggle() {
            this.set(this.current === 'light' ? 'dark' : 'light');
        },

        
        init() {
            
            let savedTheme = null;
            try {
                savedTheme = localStorage.getItem('tbeui-theme');
            } catch (e) {
                
            }
            
            
            if (!savedTheme) {
                savedTheme = 'light';
                
                
            }
            
            this.set(savedTheme);
            
            
            
            
            
            
            
            
            
        }
    };

    

    const Cascader = {
        
        states: {},

        
        toggleCascader(cascaderId) {
            this.toggle(cascaderId);
        },

        
        selectCascaderLevel1(cascaderId, value, label) {
            this.selectLevel1(cascaderId, value, label);
        },

        
        selectCascaderLevel2(cascaderId, parentKey, key, name, fullPath) {
            
            this.selectLevel2(cascaderId, key, name);
        },

        
        selectCascaderFinal(cascaderId, fullPath) {
            
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

        
        clearCascader(cascaderId, event) {
            this.clear(cascaderId, event);
        },

        
        toggle(cascaderId) {
            const cascader = document.getElementById(cascaderId);
            if (!cascader || cascader.classList.contains('is-disabled')) return;
            
            const isOpen = cascader.classList.contains('is-open');
            
            
            document.querySelectorAll('.t-cascader.is-open').forEach(c => {
                if (c.id !== cascaderId) {
                    c.classList.remove('is-open');
                    c.setAttribute('aria-expanded', 'false');
                }
            });
            
            cascader.classList.toggle('is-open');
            cascader.setAttribute('aria-expanded', (!isOpen).toString());
            
            if (!isOpen) {
                
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
        
        
        selectLevel1(cascaderId, value, label) {
            const cascader = document.getElementById(cascaderId);
            if (!cascader) return;

            const state = this.states[cascaderId] || { selectedPath: [], selectedLabels: [] };
            state.selectedPath = [value];
            state.selectedLabels = [label];
            this.states[cascaderId] = state;

            
            const menu1 = cascader.querySelector('.t-cascader__menu:first-child');
            if (menu1) {
                menu1.querySelectorAll('.t-cascader__option').forEach(opt => {
                    const isActive = opt.dataset.value === value;
                    opt.classList.toggle('is-active', isActive);
                });
            }

            
            const level2Data = this.getLevel2Data(value);
            this.renderLevel2Menu(cascaderId, level2Data);

            
            cascader.dispatchEvent(new CustomEvent('t:cascader:change', {
                detail: { value: state.selectedPath, label: state.selectedLabels }
            }));
        },

        
        getLevel2Data(parentValue) {
            
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

        
        renderLevel2Menu(cascaderId, data) {
            const cascader = document.getElementById(cascaderId);
            if (!cascader) return;

            const dropdown = cascader.querySelector('.t-cascader__dropdown');
            if (!dropdown) return;

            
            const oldMenu2 = dropdown.querySelector('.t-cascader__menu--level2');
            if (oldMenu2) {
                oldMenu2.remove();
            }

            
            if (!data || data.length === 0) return;

            
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
        
        
        selectLevel2(cascaderId, value, label) {
            const cascader = document.getElementById(cascaderId);
            if (!cascader) return;

            const state = this.states[cascaderId] || { selectedPath: [], selectedLabels: [] };
            state.selectedPath[1] = value;
            state.selectedLabels[1] = label;
            this.states[cascaderId] = state;

            
            const menu2 = cascader.querySelector('.t-cascader__menu--level2');
            if (menu2) {
                menu2.querySelectorAll('.t-cascader__option').forEach(opt => {
                    const isActive = opt.dataset.value === value;
                    opt.classList.toggle('is-active', isActive);
                });
            }

            
            const parentValue = state.selectedPath[0];
            const level3Data = this.getLevel3Data(parentValue, value);
            this.renderLevel3Menu(cascaderId, level3Data);

            
            cascader.dispatchEvent(new CustomEvent('t:cascader:change', {
                detail: { value: state.selectedPath, label: state.selectedLabels }
            }));
        },

        
        getLevel3Data(parentValue, value) {
            
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

        
        renderLevel3Menu(cascaderId, data) {
            const cascader = document.getElementById(cascaderId);
            if (!cascader) return;

            const dropdown = cascader.querySelector('.t-cascader__dropdown');
            if (!dropdown) return;

            
            const oldMenu3 = dropdown.querySelector('.t-cascader__menu--level3');
            if (oldMenu3) {
                oldMenu3.remove();
            }

            
            if (!data || data.length === 0) return;

            
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
        
        
        selectLevel3(cascaderId, value, label) {
            const cascader = document.getElementById(cascaderId);
            if (!cascader) return;
            
            const state = this.states[cascaderId] || { selectedPath: [], selectedLabels: [] };
            state.selectedPath[2] = value;
            state.selectedLabels[2] = label;
            this.states[cascaderId] = state;
            
            
            const input = document.getElementById(cascaderId + '-input');
            if (input) {
                input.value = state.selectedLabels.join(' / ');
                input.setAttribute('data-value', state.selectedPath.join(','));
            }
            
            
            cascader.classList.remove('is-open');
            cascader.setAttribute('aria-expanded', 'false');
            
            
            cascader.dispatchEvent(new CustomEvent('t:cascader:select', {
                detail: { value: state.selectedPath, label: state.selectedLabels }
            }));
        },
        
        
        clear(cascaderId, event) {
            if (event) event.stopPropagation();
            
            const cascader = document.getElementById(cascaderId);
            if (!cascader) return;
            
            
            this.states[cascaderId] = { selectedPath: [], selectedLabels: [] };
            
            
            const input = document.getElementById(cascaderId + '-input');
            if (input) {
                input.value = '';
                input.removeAttribute('data-value');
            }
            
            
            cascader.querySelectorAll('.t-cascader__option.is-active').forEach(opt => {
                opt.classList.remove('is-active');
            });
            
            
            cascader.dispatchEvent(new CustomEvent('t:cascader:clear'));
        },
        
        
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
        
        
        getValue(cascaderId) {
            const state = this.states[cascaderId] || { selectedPath: [], selectedLabels: [] };
            return {
                value: state.selectedPath,
                label: state.selectedLabels
            };
        }
    };

    
    
    const TimePicker = {
        
        states: {},
        currentPicker: null,
        
        
        toggle(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker || picker.classList.contains('is-disabled')) return;
            
            
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
        
        
        selectTime(pickerId, time) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;
            
            const input = document.getElementById(pickerId + '-input');
            if (input) {
                input.value = time;
            }
            
            
            const panel = picker.querySelector('.t-time-picker__panel');
            if (panel) {
                panel.querySelectorAll('.t-time-picker__item').forEach(item => {
                    item.classList.toggle('is-selected', item.textContent === time);
                });
            }
            
            
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
        
        
        selectHour(pickerId, hour) {
            const state = this.states[pickerId] || { selectedHour: '00', selectedMinute: '00' };
            state.selectedHour = hour;
            this.states[pickerId] = state;
            
            
            const picker = document.getElementById(pickerId);
            const columns = picker?.querySelectorAll('.t-time-picker__column');
            if (columns && columns.length > 0) {
                
                const hoursColumn = columns[0];
                hoursColumn.querySelectorAll('.t-time-picker__item').forEach(item => {
                    item.classList.toggle('is-selected', item.textContent === hour);
                });
            }
            
            this._updateInput(pickerId);
        },
        
        
        selectMinute(pickerId, minute) {
            const state = this.states[pickerId] || { selectedHour: '00', selectedMinute: '00' };
            state.selectedMinute = minute;
            this.states[pickerId] = state;
            
            
            const picker = document.getElementById(pickerId);
            const columns = picker?.querySelectorAll('.t-time-picker__column');
            if (columns && columns.length >= 3) {
                
                const minutesColumn = columns[2];
                minutesColumn.querySelectorAll('.t-time-picker__item').forEach(item => {
                    item.classList.toggle('is-selected', item.textContent === minute);
                });
            }
            
            this._updateInput(pickerId);
        },
        
        
        selectSecond(pickerId, second) {
            const state = this.states[pickerId] || { selectedHour: '00', selectedMinute: '00', selectedSecond: '00' };
            state.selectedSecond = second;
            this.states[pickerId] = state;
            
            
            const picker = document.getElementById(pickerId);
            const secondsColumn = picker?.querySelector('.t-time-picker__seconds, [data-type="seconds"]');
            if (secondsColumn) {
                secondsColumn.querySelectorAll('.t-time-picker__item').forEach(item => {
                    item.classList.toggle('is-selected', item.textContent === second);
                });
            }
            
            this._updateInput(pickerId);
        },
        
        
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
        
        
        cancel(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;
            
            picker.classList.remove('is-open');
            picker.setAttribute('aria-expanded', 'false');
            this.currentPicker = null;
            
            picker.dispatchEvent(new CustomEvent('t:time:cancel'));
        },
        
        
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
        
        
        getValue(pickerId) {
            const state = this.states[pickerId] || { selectedHour: '00', selectedMinute: '00' };
            return state.selectedHour + ':' + state.selectedMinute;
        }
    };

    
    
    const DatePicker = {
        
        states: {},
        currentPicker: null,
        
        
        toggle(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker || picker.classList.contains('is-disabled')) return;
            
            
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
                
                
                const isRange = picker.classList.contains('is-range');
                
                
                if (!this.states[pickerId]) {
                    this.states[pickerId] = {
                        currentDate: new Date(),
                        selectedDate: null,
                        selectedEndDate: null,
                        isRange: isRange,
                        selectingStart: true 
                    };
                } else {
                    this.states[pickerId].isRange = isRange;
                }
                
                
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
        
        
        render(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;
            
            const state = this.states[pickerId];
            if (!state) return;
            
            const year = state.currentDate.getFullYear();
            const month = state.currentDate.getMonth();
            
            
            const header = document.getElementById(pickerId + '-header');
            if (header) {
                header.textContent = year + '年 ' + (month + 1) + '月';
            }
            
            
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startDayOfWeek = firstDay.getDay();
            
            
            const prevMonthLastDay = new Date(year, month, 0).getDate();
            
            
            const daysContainer = document.getElementById(pickerId + '-days');
            if (!daysContainer) return;
            
            daysContainer.innerHTML = '';
            
            
            for (let i = startDayOfWeek - 1; i >= 0; i--) {
                const day = prevMonthLastDay - i;
                const dayEl = this._createDayElement(day, true);
                daysContainer.appendChild(dayEl);
            }
            
            
            const today = new Date();
            for (let day = 1; day <= daysInMonth; day++) {
                const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
                const isSelected = state.selectedDate && 
                    year === state.selectedDate.getFullYear() && 
                    month === state.selectedDate.getMonth() && 
                    day === state.selectedDate.getDate();
                
                
                const isEndSelected = state.isRange && state.selectedEndDate && 
                    year === state.selectedEndDate.getFullYear() && 
                    month === state.selectedEndDate.getMonth() && 
                    day === state.selectedEndDate.getDate();
                
                
                const isInRange = state.isRange && state.selectedDate && state.selectedEndDate && 
                    !state.selectingStart &&
                    new Date(year, month, day) > state.selectedDate && 
                    new Date(year, month, day) < state.selectedEndDate;
                
                const dayEl = this._createDayElement(day, false, isToday, isSelected || isEndSelected, pickerId, isInRange);
                daysContainer.appendChild(dayEl);
            }
            
            
            const remainingCells = 42 - (startDayOfWeek + daysInMonth);
            for (let day = 1; day <= remainingCells; day++) {
                const dayEl = this._createDayElement(day, true);
                daysContainer.appendChild(dayEl);
            }
        },
        
        
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
        
        
        selectDate(pickerId, day) {
            const state = this.states[pickerId];
            if (!state) return;
            
            const selectedDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth(), day);
            const picker = document.getElementById(pickerId);
            
            
            if (state.isRange) {
                if (state.selectingStart) {
                    
                    state.selectedDate = selectedDate;
                    state.selectingStart = false;
                    
                    
                    const startInput = document.getElementById(pickerId + '-start');
                    if (startInput) {
                        const year = selectedDate.getFullYear();
                        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                        const date = String(day).padStart(2, '0');
                        startInput.value = year + '-' + month + '-' + date;
                    }
                    
                    
                    this.render(pickerId);
                    
                    
                    picker.dispatchEvent(new CustomEvent('t:date:start-change', {
                        detail: { date: selectedDate }
                    }));
                    
                    return; 
                } else {
                    
                    state.selectedEndDate = selectedDate;
                    state.selectingStart = true; 
                    
                    
                    if (state.selectedDate && selectedDate < state.selectedDate) {
                        
                        const temp = state.selectedDate;
                        state.selectedDate = selectedDate;
                        state.selectedEndDate = temp;
                    }
                    
                    
                    const endInput = document.getElementById(pickerId + '-end');
                    if (endInput) {
                        const year = state.selectedEndDate.getFullYear();
                        const month = String(state.selectedEndDate.getMonth() + 1).padStart(2, '0');
                        const date = String(state.selectedEndDate.getDate()).padStart(2, '0');
                        endInput.value = year + '-' + month + '-' + date;
                    }
                    
                    
                    this.render(pickerId);
                    
                    
                    picker.classList.remove('is-open');
                    picker.setAttribute('aria-expanded', 'false');
                    this.currentPicker = null;
                    
                    
                    picker.dispatchEvent(new CustomEvent('t:date:range-change', {
                        detail: { 
                            startDate: state.selectedDate,
                            endDate: state.selectedEndDate
                        }
                    }));
                    
                    return;
                }
            }
            
            
            state.selectedDate = selectedDate;
            
            
            const input = document.getElementById(pickerId + '-start') || document.getElementById(pickerId + '-input');
            if (input) {
                const year = state.selectedDate.getFullYear();
                const month = String(state.selectedDate.getMonth() + 1).padStart(2, '0');
                const date = String(day).padStart(2, '0');
                input.value = year + '-' + month + '-' + date;
            }
            
            
            this.render(pickerId);
            
            
            picker.classList.remove('is-open');
            picker.setAttribute('aria-expanded', 'false');
            this.currentPicker = null;
            
            
            picker.dispatchEvent(new CustomEvent('t:date:change', {
                detail: { date: state.selectedDate }
            }));
        },
        
        
        changeMonth(pickerId, delta) {
            const state = this.states[pickerId];
            if (!state) return;
            
            state.currentDate.setMonth(state.currentDate.getMonth() + delta);
            this.render(pickerId);
        },
        
        
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
            
            
            const input = document.getElementById(pickerId + '-start') || document.getElementById(pickerId + '-input');
            if (input) {
                const year = targetDate.getFullYear();
                const month = String(targetDate.getMonth() + 1).padStart(2, '0');
                const date = String(targetDate.getDate()).padStart(2, '0');
                input.value = year + '-' + month + '-' + date;
            }
            
            
            this.render(pickerId);
            
            const picker = document.getElementById(pickerId);
            picker.classList.remove('is-open');
            picker.setAttribute('aria-expanded', 'false');
            this.currentPicker = null;
            
            
            picker.dispatchEvent(new CustomEvent('t:date:change', {
                detail: { date: targetDate }
            }));
        },
        
        
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
        
        
        getValue(pickerId) {
            const state = this.states[pickerId];
            return state ? state.selectedDate : null;
        }
    };

    
    
    const DateTimePicker = {
        
        states: {},
        currentPicker: null,
        
        
        toggle(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker || picker.classList.contains('is-disabled')) return;
            
            
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

                
                const isRange = picker.classList.contains('t-datetime-picker--range');

                
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
        
        
        render(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;
            
            const state = this.states[pickerId];
            if (!state) return;
            
            const year = state.currentDate.getFullYear();
            const month = state.currentDate.getMonth();
            
            
            const header = document.getElementById(pickerId + '-header');
            if (header) {
                header.textContent = year + '年 ' + (month + 1) + '月';
            }
            
            
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startDayOfWeek = firstDay.getDay();
            
            
            const prevMonthLastDay = new Date(year, month, 0).getDate();
            
            
            const daysContainer = document.getElementById(pickerId + '-days');
            if (!daysContainer) return;
            
            daysContainer.innerHTML = '';
            
            
            for (let i = startDayOfWeek - 1; i >= 0; i--) {
                const day = prevMonthLastDay - i;
                const dayEl = this._createDayElement(day, true);
                daysContainer.appendChild(dayEl);
            }
            
            
            const today = new Date();
            for (let day = 1; day <= daysInMonth; day++) {
                const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
                const isSelected = state.selectedDate &&
                    year === state.selectedDate.getFullYear() &&
                    month === state.selectedDate.getMonth() &&
                    day === state.selectedDate.getDate();

                
                const isEndSelected = state.isRange && state.selectedEndDate &&
                    year === state.selectedEndDate.getFullYear() &&
                    month === state.selectedEndDate.getMonth() &&
                    day === state.selectedEndDate.getDate();

                
                const isInRange = state.isRange && state.selectedDate && state.selectedEndDate &&
                    !state.selectingStart &&
                    new Date(year, month, day) > state.selectedDate &&
                    new Date(year, month, day) < state.selectedEndDate;

                const dayEl = this._createDayElement(day, false, isToday, isSelected || isEndSelected, pickerId, isInRange);
                daysContainer.appendChild(dayEl);
            }
            
            
            const remainingCells = 42 - (startDayOfWeek + daysInMonth);
            for (let day = 1; day <= remainingCells; day++) {
                const dayEl = this._createDayElement(day, true);
                daysContainer.appendChild(dayEl);
            }
        },
        
        
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
        
        
        selectDate(pickerId, day) {
            const state = this.states[pickerId];
            if (!state) return;

            const selectedDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth(), day);

            
            if (state.isRange) {
                if (state.selectingStart) {
                    
                    state.selectedDate = selectedDate;
                    state.selectingStart = false;

                    
                    const startInput = document.getElementById(pickerId + '-start');
                    if (startInput) {
                        const year = selectedDate.getFullYear();
                        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                        const dateStr = String(day).padStart(2, '0');
                        startInput.value = year + '-' + month + '-' + dateStr;
                    }

                    
                    setTimeout(() => {
                        this.render(pickerId);
                    }, 0);

                    return; 
                } else {
                    
                    state.selectedEndDate = selectedDate;
                    state.selectingStart = true; 

                    
                    if (state.selectedDate && selectedDate < state.selectedDate) {
                        const temp = state.selectedDate;
                        state.selectedDate = selectedDate;
                        state.selectedEndDate = temp;
                    }

                    
                    const endInput = document.getElementById(pickerId + '-end');
                    if (endInput) {
                        const year = state.selectedEndDate.getFullYear();
                        const month = String(state.selectedEndDate.getMonth() + 1).padStart(2, '0');
                        const dateStr = String(state.selectedEndDate.getDate()).padStart(2, '0');
                        endInput.value = year + '-' + month + '-' + dateStr;
                    }

                    
                    const picker = document.getElementById(pickerId);
                    if (picker) {
                        picker.classList.remove('is-open');
                        picker.setAttribute('aria-expanded', 'false');
                    }
                    this.currentPicker = null;

                    return;
                }
            }

            
            state.selectedDate = selectedDate;

            
            const input = document.getElementById(pickerId + '-input');
            if (input) {
                const year = selectedDate.getFullYear();
                const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const dateStr = String(day).padStart(2, '0');
                input.value = year + '-' + month + '-' + dateStr;
            }

            
            setTimeout(() => {
                this.render(pickerId);
            }, 0);
        },
        
        
        selectHour(pickerId, hour) {
            const state = this.states[pickerId];
            if (!state) return;
            
            state.selectedHour = hour;
            
            
            const hoursColumn = document.getElementById(pickerId + '-hours');
            if (hoursColumn) {
                hoursColumn.querySelectorAll('.t-datetime-picker__time-item').forEach(item => {
                    item.classList.toggle('is-selected', item.textContent === hour);
                });
            }
        },
        
        
        selectMinute(pickerId, minute) {
            const state = this.states[pickerId];
            if (!state) return;
            
            state.selectedMinute = minute;
            
            
            const minutesColumn = document.getElementById(pickerId + '-minutes');
            if (minutesColumn) {
                minutesColumn.querySelectorAll('.t-datetime-picker__time-item').forEach(item => {
                    item.classList.toggle('is-selected', item.textContent === minute);
                });
            }
        },
        
        
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
        
        
        cancel(pickerId) {
            const picker = document.getElementById(pickerId);
            if (!picker) return;
            
            picker.classList.remove('is-open');
            picker.setAttribute('aria-expanded', 'false');
            this.currentPicker = null;
            
            picker.dispatchEvent(new CustomEvent('t:datetime:cancel'));
        },
        
        
        changeMonth(pickerId, delta) {
            const state = this.states[pickerId];
            if (!state) return;
            
            state.currentDate.setMonth(state.currentDate.getMonth() + delta);
            this.render(pickerId);
        },
        
        
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

    
    
    const Upload = {
        
        states: {},
        
        
        init() {
            
            document.querySelectorAll('.t-upload__input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const uploadId = input.closest('.t-upload')?.id;
                    if (uploadId) {
                        this.handleFileSelect(uploadId, e.target.files);
                    }
                });
            });
            
            
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
        
        
        handleFileSelect(uploadId, files) {
            const upload = document.getElementById(uploadId);
            if (!upload) return;
            
            
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
                    status: 'ready', 
                    progress: 0
                };
                
                state.fileList.push(fileItem);
                
                
                if (fileList) {
                    this.addFileToList(fileList, fileItem, uploadId);
                }
            });
            
            
            upload.dispatchEvent(new CustomEvent('t:upload:select', {
                detail: { files: state.fileList }
            }));
            
            
            const action = upload.dataset.action;
            if (action) {
                this.upload(uploadId, action);
            }
        },
        
        
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
        
        
        formatFileSize(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        
        
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
            
            
            upload.dispatchEvent(new CustomEvent('t:upload:remove', {
                detail: { fileId }
            }));
        },
        
        
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
            
            
            const input = upload?.querySelector('.t-upload__input');
            if (input) {
                input.value = '';
            }
        },
        
        
        getFileList(uploadId) {
            const state = this.states[uploadId];
            return state ? state.fileList : [];
        }
    };

    
    
    const Form = {
        
        states: {},
        
        
        init() {
            document.querySelectorAll('.t-form').forEach(form => {
                const formId = form.id;
                if (!formId) return;
                
                
                this.states[formId] = {
                    fields: {},
                    errors: {},
                    rules: this.parseRules(form)
                };
                
                
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.submit(formId);
                });
                
                
                form.querySelectorAll('[data-validate]').forEach(field => {
                    field.addEventListener('blur', () => {
                        this.validateField(formId, field);
                    });
                });
            });
        },
        
        
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
        
        
        clearError(formId, field) {
            const formItem = field.closest('.t-form-item');
            if (!formItem) return;
            
            formItem.classList.remove('is-error');
            
            const errorEl = formItem.querySelector('.t-form__error');
            if (errorEl) {
                errorEl.remove();
            }
        },
        
        
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
        
        
        submit(formId) {
            if (!this.validate(formId)) {
                return;
            }
            
            const form = document.getElementById(formId);
            const state = this.states[formId];
            
            if (!form) return;
            
            
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            
            form.dispatchEvent(new CustomEvent('t:form:submit', {
                detail: { data }
            }));
            
            
            const action = form.getAttribute('action');
            const method = form.getAttribute('method') || 'POST';
            
            if (action) {
                this.sendRequest(formId, action, method, data);
            }
        },
        
        
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
        
        
        reset(formId) {
            const form = document.getElementById(formId);
            const state = this.states[formId];
            
            if (!form) return;
            
            form.reset();
            
            if (state) {
                state.errors = {};
            }
            
            
            form.querySelectorAll('.t-form-item.is-error').forEach(item => {
                item.classList.remove('is-error');
                const errorEl = item.querySelector('.t-form__error');
                if (errorEl) {
                    errorEl.remove();
                }
            });
            
            form.dispatchEvent(new CustomEvent('t:form:reset'));
        },
        
        
        setFieldValue(formId, fieldName, value) {
            const form = document.getElementById(formId);
            if (!form) return;
            
            const field = form.querySelector('[name="' + fieldName + '"]');
            if (field) {
                field.value = value;
            }
        },
        
        
        getFieldValue(formId, fieldName) {
            const form = document.getElementById(formId);
            if (!form) return null;
            
            const field = form.querySelector('[name="' + fieldName + '"]');
            return field ? field.value : null;
        },
        
        
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
        
        
        changeLabelPosition(formId, position) {
            const form = document.getElementById(formId);
            if (!form) return;
            
            
            form.classList.remove('t-form--label-left', 't-form--label-right', 't-form--label-top');
            
            
            form.classList.add('t-form--label-' + position);
            
            
            form.dispatchEvent(new CustomEvent('t:form:labelPositionChange', {
                detail: { position: position }
            }));
        }
    };

    

    const Pagination = {
        
        states: {},

        
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

            
            if (hideOnSinglePage && totalPages <= 1) {
                container.style.display = 'none';
                return;
            }

            container.style.display = '';

            
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

            
            const prevBtn = document.createElement('button');
            prevBtn.className = 't-pagination__btn t-pagination__prev';
            prevBtn.disabled = disabled || currentPage <= 1;
            prevBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';
            prevBtn.onclick = () => this.changePage(containerId, currentPage - 1);
            container.appendChild(prevBtn);

            
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

            
            const nextBtn = document.createElement('button');
            nextBtn.className = 't-pagination__btn t-pagination__next';
            nextBtn.disabled = disabled || currentPage >= totalPages;
            nextBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>';
            nextBtn.onclick = () => this.changePage(containerId, currentPage + 1);
            container.appendChild(nextBtn);

            
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

        
        changePageSize(containerId, pageSize) {
            const state = this.states[containerId];
            if (!state || state.disabled) return;

            state.pageSize = pageSize;
            state.currentPage = 1;
            state.totalPages = Math.ceil(state.total / pageSize);

            
            this.render(containerId);

            if (state.onSizeChange) {
                state.onSizeChange(pageSize);
            }
            if (state.onChange) {
                state.onChange(1);
            }
        }
    };

    
    
    const Transfer = {
        
        states: {},
        
        
        init() {
            document.querySelectorAll('.t-transfer').forEach(transfer => {
                const transferId = transfer.id;
                if (!transferId) return;
                
                
                this.states[transferId] = {
                    leftData: [],
                    rightData: [],
                    leftChecked: [],
                    rightChecked: []
                };
                
                
                this.parseData(transferId);
            });
        },
        
        
        parseData(transferId) {
            const transfer = document.getElementById(transferId);
            if (!transfer) return;
            
            const state = this.states[transferId];
            
            
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
            
            
            this.updateCheckUI(transferId, direction, key);
            
            
            this.updateCheckAllState(transferId, direction);
        },
        
        
        updateCheckUI(transferId, direction, key) {
            const transfer = document.getElementById(transferId);
            if (!transfer) return;
            
            const panel = transfer.querySelector('.t-transfer__panel--' + direction);
            const item = panel?.querySelector(`[data-key="${key}"]`);
            
            if (item) {
                item.classList.toggle('is-checked');
            }
        },
        
        
        checkAll(transferId, direction) {
            const state = this.states[transferId];
            if (!state) return;
            
            const dataArray = direction === 'left' ? state.leftData : state.rightData;
            const checkedArray = direction === 'left' ? state.leftChecked : state.rightChecked;
            const allChecked = checkedArray.length === dataArray.filter(d => !d.disabled).length;
            
            if (allChecked) {
                
                checkedArray.length = 0;
            } else {
                
                checkedArray.length = 0;
                dataArray.forEach(item => {
                    if (!item.disabled) {
                        checkedArray.push(item.key);
                    }
                });
            }
            
            
            this.renderPanel(transferId, direction);
            this.updateCheckAllState(transferId, direction);
        },
        
        
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
            
            
            const countEl = panel?.querySelector('.t-transfer__count');
            if (countEl) {
                const checkedArray = direction === 'left' ? state.leftChecked : state.rightChecked;
                const dataArray = direction === 'left' ? state.leftData : state.rightData;
                countEl.textContent = checkedArray.length + '/' + dataArray.length;
            }
        },
        
        
        toRight(transferId) {
            const state = this.states[transferId];
            if (!state || state.leftChecked.length === 0) return;
            
            
            const itemsToMove = state.leftData.filter(item => state.leftChecked.includes(item.key));
            state.rightData.push(...itemsToMove);
            state.leftData = state.leftData.filter(item => !state.leftChecked.includes(item.key));
            
            
            state.leftChecked = [];
            
            
            this.renderPanel(transferId, 'left');
            this.renderPanel(transferId, 'right');
            
            
            const transfer = document.getElementById(transferId);
            transfer.dispatchEvent(new CustomEvent('t:transfer:change', {
                detail: { leftData: state.leftData, rightData: state.rightData }
            }));
        },
        
        
        toLeft(transferId) {
            const state = this.states[transferId];
            if (!state || state.rightChecked.length === 0) return;
            
            
            const itemsToMove = state.rightData.filter(item => state.rightChecked.includes(item.key));
            state.leftData.push(...itemsToMove);
            state.rightData = state.rightData.filter(item => !state.rightChecked.includes(item.key));
            
            
            state.rightChecked = [];
            
            
            this.renderPanel(transferId, 'left');
            this.renderPanel(transferId, 'right');
            
            
            const transfer = document.getElementById(transferId);
            transfer.dispatchEvent(new CustomEvent('t:transfer:change', {
                detail: { leftData: state.leftData, rightData: state.rightData }
            }));
        },
        
        
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
            
            
            this.updateCheckAllState(transferId, direction);
        },
        
        
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
        
        
        getData(transferId) {
            const state = this.states[transferId];
            if (!state) return { leftData: [], rightData: [] };
            
            return {
                leftData: state.leftData,
                rightData: state.rightData
            };
        }
    };

    
    
    const Popover = {
        
        states: {},

        
        init() {
            
            document.addEventListener('click', (e) => {
                document.querySelectorAll('.t-popover.is-visible').forEach(popover => {
                    const trigger = document.querySelector(`[data-popover="${popover.id}"]`);
                    if (trigger && !trigger.contains(e.target) && !popover.contains(e.target)) {
                        this.hide(popover.id);
                    }
                });
            });

            
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
        
        
        show(popoverId, trigger) {
            const popover = document.getElementById(popoverId);
            if (!popover) return;
            
            
            document.querySelectorAll('.t-popover.is-visible').forEach(p => {
                if (p.id !== popoverId) {
                    p.classList.remove('is-visible');
                }
            });
            
            popover.classList.add('is-visible');
            
            
            if (trigger) {
                this.position(popover, trigger);
            }
            
            
            popover.dispatchEvent(new CustomEvent('t:popover:show'));
        },
        
        
        hide(popoverId) {
            const popover = document.getElementById(popoverId);
            if (!popover) return;
            
            popover.classList.remove('is-visible');
            
            
            popover.dispatchEvent(new CustomEvent('t:popover:hide'));
        },
        
        
        toggle(popoverId, trigger) {
            const popover = document.getElementById(popoverId);
            if (!popover) return;
            
            if (popover.classList.contains('is-visible')) {
                this.hide(popoverId);
            } else {
                this.show(popoverId, trigger);
            }
        },
        
        
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

    
    
    const Tabs = {
        
        states: {},
        
        
        init() {
            document.querySelectorAll('.t-tabs').forEach(tabs => {
                const tabsId = tabs.id;
                if (!tabsId) return;
                
                
                const activeTab = tabs.querySelector('.t-tabs__item.is-active');
                this.states[tabsId] = {
                    activeName: activeTab?.dataset.name || ''
                };
                
                
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
        
        
        switchTab(tabsId, tabName) {
            const tabs = document.getElementById(tabsId);
            const state = this.states[tabsId];
            if (!tabs || !state) return;
            
            
            state.activeName = tabName;
            
            
            tabs.querySelectorAll('.t-tabs__item').forEach(tab => {
                tab.classList.toggle('is-active', tab.dataset.name === tabName);
            });
            
            
            tabs.querySelectorAll('.t-tabs__pane').forEach(pane => {
                pane.classList.toggle('is-active', pane.dataset.name === tabName);
            });
            
            
            tabs.dispatchEvent(new CustomEvent('t:tabs:change', {
                detail: { name: tabName }
            }));
        },
        
        
        getActiveTab(tabsId) {
            const state = this.states[tabsId];
            return state ? state.activeName : '';
        },
        
        
        addTab(tabsId, tab) {
            const tabs = document.getElementById(tabsId);
            if (!tabs) return;
            
            const header = tabs.querySelector('.t-tabs__header');
            const content = tabs.querySelector('.t-tabs__content');
            
            if (header && content) {
                
                const tabEl = document.createElement('div');
                tabEl.className = 't-tabs__item';
                tabEl.dataset.name = tab.name;
                tabEl.textContent = tab.label;
                tabEl.addEventListener('click', () => {
                    this.switchTab(tabsId, tab.name);
                });
                header.appendChild(tabEl);
                
                
                const paneEl = document.createElement('div');
                paneEl.className = 't-tabs__pane';
                paneEl.dataset.name = tab.name;
                paneEl.innerHTML = tab.content;
                content.appendChild(paneEl);
            }
        },
        
        
        removeTab(tabsId, tabName) {
            const tabs = document.getElementById(tabsId);
            const state = this.states[tabsId];
            if (!tabs || !state) return;
            
            
            const tab = tabs.querySelector(`.t-tabs__item[data-name="${tabName}"]`);
            if (tab) {
                tab.remove();
            }
            
            
            const pane = tabs.querySelector(`.t-tabs__pane[data-name="${tabName}"]`);
            if (pane) {
                pane.remove();
            }
            
            
            if (state.activeName === tabName) {
                const firstTab = tabs.querySelector('.t-tabs__item');
                if (firstTab) {
                    this.switchTab(tabsId, firstTab.dataset.name);
                }
            }
        }
    };

    
    
    const Image = {
        
        currentIndex: 0,
        
        
        previewList: [],
        
        
        init() {
            
            document.addEventListener('click', (e) => {
                const img = e.target.closest('.t-image__img');
                if (img && img.closest('.t-image')?.classList.contains('is-preview')) {
                    const previewSrc = img.dataset.preview || img.src;
                    this.preview(previewSrc);
                }
            });
            
            
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
        
        
        showPreviewModal() {
            
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
                
                
                previewContainer.querySelector('.t-image-preview__mask').addEventListener('click', () => {
                    this.closePreview();
                });
                
                document.body.appendChild(previewContainer);
            }
            
            previewContainer.classList.add('is-visible');
            this.updatePreviewImage();
        },
        
        
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
        
        
        closePreview() {
            const previewContainer = document.getElementById('t-image-preview');
            if (previewContainer) {
                previewContainer.classList.remove('is-visible');
            }
        },
        
        
        isPreviewOpen() {
            const previewContainer = document.getElementById('t-image-preview');
            return previewContainer?.classList.contains('is-visible');
        },
        
        
        prevImage() {
            if (this.previewList.length <= 1) return;
            
            this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = this.previewList.length - 1;
            }
            
            this.updatePreviewImage();
        },
        
        
        nextImage() {
            if (this.previewList.length <= 1) return;
            
            this.currentIndex++;
            if (this.currentIndex >= this.previewList.length) {
                this.currentIndex = 0;
            }
            
            this.updatePreviewImage();
        }
    };

    
    
    const Avatar = {
        
        handleError(img, fallbackText) {
            if (!img) return;
            
            const avatar = img.closest('.t-avatar');
            if (!avatar) return;
            
            
            img.remove();
            
            if (fallbackText) {
                
                const textSpan = document.createElement('span');
                textSpan.className = 't-avatar__text';
                textSpan.textContent = fallbackText;
                avatar.appendChild(textSpan);
            } else {
                
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

    
    
    const Tag = {
        
        remove(closeBtn) {
            if (!closeBtn) return;
            
            const tag = closeBtn.closest('.t-tag');
            if (!tag) return;
            
            
            tag.classList.add('t-tag-leave');
            
            
            setTimeout(() => {
                if (tag.parentNode) {
                    tag.parentNode.removeChild(tag);
                }
            }, 300);
            
            
            const tagGroup = tag.closest('.t-tag-group');
            if (tagGroup) {
                tagGroup.dispatchEvent(new CustomEvent('t:tag:close', {
                    detail: { tag: tag }
                }));
            }
        },
        
        
        removeDynamic(closeBtn) {
            this.remove(closeBtn);
        },
        
        
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
        
        
        hideInput(groupId) {
            const group = groupId ? document.getElementById(groupId) : document.querySelector('.t-tag-group');
            if (!group) return;
            
            const addBtn = group.querySelector('.t-tag--editable');
            const tagInput = group.querySelector('.t-tag-input');
            const inputField = group.querySelector('.t-tag-input input');
            
            
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
        
        
        add(text, group) {
            if (!group) return;

            const newTag = document.createElement('span');
            newTag.className = 't-tag t-tag-enter';
            newTag.innerHTML = text + '<i class="t-tag__close" onclick="removeDynamicTag(this)">×</i>';
            
            
            const addBtn = group.querySelector('.t-tag--editable');
            if (addBtn) {
                group.insertBefore(newTag, addBtn);
            } else {
                group.appendChild(newTag);
            }
            
            
            setTimeout(() => {
                newTag.classList.remove('t-tag-enter');
            }, 300);
            
            
            group.dispatchEvent(new CustomEvent('t:tag:add', {
                detail: { text: text, tag: newTag }
            }));
        }
    };

    
    
    const Carousel = {
        
        states: {},
        
        
        init() {
            document.querySelectorAll('.t-carousel').forEach(carousel => {
                const carouselId = carousel.id;
                if (!carouselId) return;
                
                
                const autoplay = carousel.dataset.autoplay === 'true';
                const interval = parseInt(carousel.dataset.interval) || 3000;
                const loop = carousel.dataset.loop !== 'false';
                
                
                this.states[carouselId] = {
                    currentIndex: 0,
                    itemCount: carousel.querySelectorAll('.t-carousel__item').length,
                    autoplay: autoplay,
                    interval: interval,
                    loop: loop,
                    timer: null
                };
                
                
                this.bindEvents(carouselId);
                
                
                if (autoplay) {
                    this.startAutoplay(carouselId);
                }
                
                
                this.updateIndicators(carouselId);
            });
        },
        
        
        bindEvents(carouselId) {
            const carousel = document.getElementById(carouselId);
            if (!carousel) return;
            
            const state = this.states[carouselId];
            
            
            const prevBtn = carousel.querySelector('.t-carousel__arrow--left');
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    this.prev(carouselId);
                    this.resetAutoplay(carouselId);
                });
            }
            
            
            const nextBtn = carousel.querySelector('.t-carousel__arrow--right');
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    this.next(carouselId);
                    this.resetAutoplay(carouselId);
                });
            }
            
            
            carousel.querySelectorAll('.t-carousel__indicator').forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    this.goTo(carouselId, index);
                    this.resetAutoplay(carouselId);
                });
            });
            
            
            carousel.addEventListener('mouseenter', () => {
                this.stopAutoplay(carouselId);
            });
            
            carousel.addEventListener('mouseleave', () => {
                if (state.autoplay) {
                    this.startAutoplay(carouselId);
                }
            });
        },
        
        
        goTo(carouselId, index) {
            const carousel = document.getElementById(carouselId);
            const state = this.states[carouselId];
            if (!carousel || !state) return;
            
            
            if (index < 0) {
                index = state.loop ? state.itemCount - 1 : 0;
            } else if (index >= state.itemCount) {
                index = state.loop ? 0 : state.itemCount - 1;
            }
            
            state.currentIndex = index;
            
            
            const track = carousel.querySelector('.t-carousel__track');
            if (track) {
                track.style.transform = 'translateX(-' + (index * 100) + '%)';
            }
            
            
            this.updateIndicators(carouselId);
            
            
            carousel.dispatchEvent(new CustomEvent('t:carousel:change', {
                detail: { index: index }
            }));
        },
        
        
        next(carouselId) {
            const state = this.states[carouselId];
            if (!state) return;
            
            this.goTo(carouselId, state.currentIndex + 1);
        },
        
        
        prev(carouselId) {
            const state = this.states[carouselId];
            if (!state) return;
            
            this.goTo(carouselId, state.currentIndex - 1);
        },
        
        
        updateIndicators(carouselId) {
            const carousel = document.getElementById(carouselId);
            const state = this.states[carouselId];
            if (!carousel || !state) return;
            
            carousel.querySelectorAll('.t-carousel__indicator').forEach((indicator, index) => {
                indicator.classList.toggle('is-active', index === state.currentIndex);
            });
        },
        
        
        startAutoplay(carouselId) {
            const state = this.states[carouselId];
            if (!state || !state.autoplay) return;
            
            this.stopAutoplay(carouselId);
            
            state.timer = setInterval(() => {
                this.next(carouselId);
            }, state.interval);
        },
        
        
        stopAutoplay(carouselId) {
            const state = this.states[carouselId];
            if (!state || !state.timer) return;
            
            clearInterval(state.timer);
            state.timer = null;
        },
        
        
        resetAutoplay(carouselId) {
            const state = this.states[carouselId];
            if (!state || !state.autoplay) return;
            
            this.stopAutoplay(carouselId);
            this.startAutoplay(carouselId);
        },
        
        
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

    
    
    const Tree = {
        
        states: {},
        
        
        dragNode: null,
        dragTreeId: null,
        dragNodeEl: null,
        
        
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
        
        
        renderTree(treeId, data, options = {}) {
            const container = document.getElementById(treeId);
            if (!container) return;

            
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

            
            for (let i = 0; i < level; i++) {
                const indent = document.createElement('span');
                indent.className = 't-tree-node__indent';
                contentEl.appendChild(indent);
            }

            
            const expandIcon = document.createElement('span');
            expandIcon.className = 't-tree-node__expand-icon';
            
            
            const hasChildren = node.children && node.children.length > 0;
            const isLeafNode = (!hasChildren && !options.lazy) || node.isLeaf === true;
            
            if (isLeafNode) {
                
                expandIcon.classList.add('is-leaf');
            } else {
                
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
                
                checkbox.addEventListener('mousedown', (e) => {
                    e.stopPropagation();
                });
                contentEl.appendChild(checkbox);
            }

            
            if (options.renderContent) {
                contentEl.appendChild(options.renderContent(node));
            } else {
                const label = document.createElement('span');
                label.className = 't-tree-node__label';
                label.textContent = node.label;
                contentEl.appendChild(label);
            }

            
            contentEl.onclick = (e) => {
                if (!node.disabled) {
                    
                    const isSpecialElement = e.target.closest('.t-tree-node__checkbox') || 
                                           e.target.closest('.t-tree-node__expand-icon');
                    
                    
                    if (!isSpecialElement && (hasChildren || (options.lazy && !node.isLeaf && !node.loaded))) {
                        this.toggleNode(treeId, node, nodeEl);
                    } else {
                        this.selectNode(treeId, node, contentEl);
                    }
                }
            };

            nodeEl.appendChild(contentEl);

            
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
                
                const childrenEl = document.createElement('div');
                childrenEl.className = 't-tree-node__children collapsed';
                childrenEl.style.height = '0';
                nodeEl.appendChild(childrenEl);
            }

            
            if (options.draggable && !node.disabled) {
                contentEl.draggable = true;
                contentEl.ondragstart = (e) => this.handleDragStart(e, treeId, node, nodeEl);
                contentEl.ondragover = (e) => this.handleDragOver(e, treeId, node, nodeEl);
                contentEl.ondrop = (e) => this.handleDrop(e, treeId, node, nodeEl);
                contentEl.ondragend = (e) => this.handleDragEnd(e, treeId, nodeEl);
            }

            return nodeEl;
        },
        
        
        toggleNode(treeId, node, nodeEl) {
            const state = this.states[treeId];
            const options = state.options;
            const expandIcon = nodeEl.querySelector('.t-tree-node__expand-icon');
            const childrenEl = nodeEl.querySelector('.t-tree-node__children');

            
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

            
            if (options.lazy && !node.loaded && !node.isLeaf && options.load) {
                
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

                    
                    state.expandedKeys.add(node.id);

                    
                    this.renderTree(treeId, state.data, options);
                });
                return;
            }

            
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
        
        
        uncheckChildren(treeId, node) {
            const state = this.states[treeId];
            if (node.children) {
                node.children.forEach(child => {
                    state.checkedKeys.delete(child.id);
                    this.uncheckChildren(treeId, child);
                });
            }
        },
        
        
        updateParentCheckbox(treeId, node) {
            
        },
        
        
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
        
        
        selectNode(treeId, node, contentEl) {
            const state = this.states[treeId];
            state.currentKey = node.id;
            
            contentEl.parentElement.querySelectorAll('.t-tree-node__content').forEach(el => {
                el.classList.remove('is-current');
            });
            contentEl.classList.add('is-current');
        },
        
        
        loadNode(node, resolve) {
            setTimeout(() => {
                resolve([
                    { id: node.id * 10 + 1, label: `子节点 ${node.id}-1` },
                    { id: node.id * 10 + 2, label: `子节点 ${node.id}-2` }
                ]);
            }, 500);
        },
        
        
        renderCustomContent(node) {
            const div = document.createElement('div');
            div.className = 't-tree-node__custom-content';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.gap = '8px';
            div.innerHTML = `<span>📁</span><span>${node.label}</span>`;
            return div;
        },
        
        
        filterTree(keyword) {
            const tree = document.getElementById('tree-filter');
            if (!tree) return;
            
            const allNodes = tree.querySelectorAll('.t-tree-node');
            
            
            if (!keyword || keyword.trim() === '') {
                allNodes.forEach(node => {
                    node.style.display = '';
                    
                    const children = node.querySelector('.t-tree-node__children');
                    if (children) {
                        children.style.display = '';
                        children.classList.remove('collapsed');
                        children.style.height = 'auto';
                    }
                    
                    const expandIcon = node.querySelector('.t-tree-node__expand-icon');
                    if (expandIcon && !expandIcon.classList.contains('is-leaf')) {
                        expandIcon.style.display = '';
                    }
                });
                return;
            }
            
            const lowerKeyword = keyword.toLowerCase();
            
            
            allNodes.forEach(node => {
                node.style.display = 'none';
            });
            
            
            const matchedNodes = new Set();
            
            allNodes.forEach(node => {
                const label = node.querySelector('.t-tree-node__label');
                if (label && label.textContent.toLowerCase().includes(lowerKeyword)) {
                    matchedNodes.add(node);
                    
                    
                    let parent = node.parentElement;
                    while (parent && !parent.classList.contains('t-tree-content')) {
                        if (parent.classList.contains('t-tree-node')) {
                            matchedNodes.add(parent);
                            
                            const children = parent.querySelector('.t-tree-node__children');
                            if (children) {
                                children.style.display = '';
                                children.classList.remove('collapsed');
                                children.style.height = 'auto';
                            }
                            
                            const expandIcon = parent.querySelector('.t-tree-node__expand-icon');
                            if (expandIcon && !expandIcon.classList.contains('is-leaf')) {
                                expandIcon.classList.add('expanded');
                            }
                        }
                        parent = parent.parentElement;
                    }
                    
                    
                    this.showAllChildren(node);
                }
            });
            
            
            matchedNodes.forEach(node => {
                node.style.display = '';
            });
        },
        
        
        showAllChildren(node) {
            const childrenContainer = node.querySelector('.t-tree-node__children');
            if (childrenContainer) {
                childrenContainer.style.display = '';
                childrenContainer.classList.remove('collapsed');
                childrenContainer.style.height = 'auto';
                
                
                const expandIcon = node.querySelector('.t-tree-node__expand-icon');
                if (expandIcon && !expandIcon.classList.contains('is-leaf')) {
                    expandIcon.classList.add('expanded');
                }
                
                
                const childNodes = childrenContainer.querySelectorAll(':scope > .t-tree-node');
                childNodes.forEach(childNode => {
                    childNode.style.display = '';
                    this.showAllChildren(childNode);
                });
            }
        },
        
        
        handleDragStart(e, treeId, node, nodeEl) {
            this.dragNode = node;
            this.dragTreeId = treeId;
            this.dragNodeEl = nodeEl;
            
            e.dataTransfer.setData('text/plain', JSON.stringify({
                nodeId: node.id,
                nodeLabel: node.label
            }));
            e.dataTransfer.effectAllowed = 'move';
            
            
            setTimeout(() => {
                nodeEl.classList.add('is-dragging');
            }, 0);
        },
        
        
        handleDragOver(e, treeId, node, nodeEl) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            
            if (this.dragTreeId !== treeId) return;
            
            
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
        
        
        handleDrop(e, treeId, targetNode, targetNodeEl) {
            e.preventDefault();
            
            
            if (this.dragTreeId !== treeId || this.dragNode.id === targetNode.id) {
                this.handleDragEnd(e, treeId, targetNodeEl);
                return;
            }
            
            
            if (this.isDescendant(targetNodeEl, this.dragNodeEl)) {
                
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
            
            
            this.moveNode(treeId, this.dragNode, targetNode, dropType);
            
            
            
            this.handleDragEnd(e, treeId, targetNodeEl);
        },
        
        
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
            
            
            document.querySelectorAll('.t-tree-node__content.is-drag-over').forEach(el => {
                el.classList.remove('is-drag-over');
            });
            
            
            this.dragNode = null;
            this.dragTreeId = null;
            this.dragNodeEl = null;
        },
        
        
        isDescendant(source, target) {
            let parent = target.parentElement;
            while (parent) {
                if (parent === source) return true;
                parent = parent.parentElement;
            }
            return false;
        },
        
        
        moveNode(treeId, sourceNode, targetNode, dropType) {
            const state = this.states[treeId];
            const data = state.data;
            
            
            this.removeNodeFromTree(data, sourceNode.id);
            
            
            if (dropType === 'inner') {
                
                const targetNodeInData = this.findNodeInTree(data, targetNode.id);
                if (targetNodeInData) {
                    if (!targetNodeInData.children) {
                        targetNodeInData.children = [];
                    }
                    targetNodeInData.children.push(JSON.parse(JSON.stringify(sourceNode)));
                    
                    state.expandedKeys.add(targetNode.id);
                }
            } else {
                
                const result = this.findNodeAndParent(data, targetNode.id);
                if (result) {
                    const { parent, index } = result;
                    const insertIndex = dropType === 'before' ? index : index + 1;
                    parent.splice(insertIndex, 0, JSON.parse(JSON.stringify(sourceNode)));
                }
            }
            
            
            this.renderTree(treeId, data, state.options);
        },
        
        
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

    

    const InfiniteScroll = {
        
        instances: {},

        
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

    
    
    function init() {
        
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
        
        
        document.addEventListener('keydown', (e) => {
            
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
        
    }

    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    
    
    
    window.init = init;
    
    
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

    
    window.toggleCheckAll = function() {
        Checkbox.toggleCheckAll();
    };
    window.toggleCheckboxButton = function(element) {
        Checkbox.toggleButton(element);
    };

    
    window.toggleSelect = function(selectId) {
        Select.toggleSelect(selectId);
    };
    window.selectOption = function(selectId, value, label) {
        Select.selectOption(selectId, value, label);
    };
    window.clearSelect = function(selectId, event) {
        Select.clearSelect(selectId, event);
    };

    
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

    
    window.handleAvatarError = function(img, fallbackText) {
        Avatar.handleError(img, fallbackText);
    };

    
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

    
    window.createPagination = function(containerId, options) {
        Pagination.create(containerId, options);
    };
    window.changePaginationPage = function(containerId, page) {
        Pagination.changePage(containerId, page);
    };
    window.changePaginationPageSize = function(containerId, pageSize) {
        Pagination.changePageSize(containerId, pageSize);
    };

    
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

    
    window.selectRadioButton = function(button, groupName) {
        Radio.selectRadioButton(button, groupName);
    };

    
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

    
    window.changeNumber = function(inputId, delta) {
        InputNumber.changeNumber(inputId, delta);
    };
    window.changeNumberStep = function(inputId, delta, step) {
        InputNumber.changeNumberStep(inputId, delta, step);
    };
    window.changeNumberStrict = function(inputId, delta, step) {
        InputNumber.changeNumberStrict(inputId, delta, step);
    };

    
    window.toggleSwitch = function(switchId) {
        Switch.toggleSwitch(switchId);
    };

    
    window.clickSlider = function(event, sliderId) {
        Slider.clickSlider(event, sliderId);
    };
    window.startDragSlider = function(event, sliderId, buttonIdx) {
        Slider.startDragSlider(event, sliderId, buttonIdx);
    };

    
    window.setRate = function(id, value) {
        Rate.setRate(id, value);
    };
    window.hoverRate = function(id, value) {
        Rate.hoverRate(id, value);
    };
    window.leaveRate = function(id) {
        Rate.leaveRate(id);
    };

    
    window.changeLabelPosition = function(formId, position) {
        Form.changeLabelPosition(formId, position);
    };

    
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

        
        items.forEach(item => item.classList.remove('is-active'));
        panes.forEach(pane => pane.classList.remove('is-active'));

        
        if (items[index]) {
            items[index].classList.add('is-active');
        }
        if (panes[index]) {
            panes[index].classList.add('is-active');
        }
    };
    
    
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
        
        
        if (items.length <= 1) {
            alert('至少保留一个标签页');
            return;
        }
        
        
        if (items[index]) {
            items[index].remove();
        }
        if (panes[index]) {
            panes[index].remove();
        }
        
        
        const newItems = nav.querySelectorAll('.t-tabs__item');
        newItems.forEach((item, i) => {
            item.setAttribute('data-index', i);
            item.setAttribute('onclick', `switchTab('${tabsId}', ${i})`);
            const closeBtn = item.querySelector('.t-tabs__close');
            if (closeBtn) {
                closeBtn.setAttribute('onclick', `closeTab(event, '${tabsId}', ${i})`);
            }
        });
        
        
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
        
        
        const newItem = document.createElement('div');
        newItem.className = 't-tabs__item';
        newItem.setAttribute('data-index', index);
        newItem.setAttribute('onclick', `switchTab('${tabsId}', ${index})`);
        newItem.innerHTML = `
            <span>新标签 ${tabCounter}</span>
            <span class="t-tabs__close" onclick="closeTab(event, '${tabsId}', ${index})">×</span>
        `;
        
        
        const newPane = document.createElement('div');
        newPane.className = 't-tabs__pane';
        newPane.textContent = `新标签 ${tabCounter} 内容`;
        
        
        nav.appendChild(newItem);
        content.appendChild(newPane);
        
        
        window.switchTab(tabsId, index);
    };

    
    window.showTMessage = function(options) {
        return TbeUI.Message.show(options);
    };

    
    window.showMessage = window.showTMessage;

    window.closeTMessage = function(id) {
        const el = typeof id === 'string' ? document.getElementById(id) : id;
        if (el) TbeUI.Message.close(el);
    };

    
    window.closeMessage = window.closeTMessage;

    window.closeAllTMessages = function() {
        TbeUI.Message.closeAll();
    };

    
    window.closeAllMessages = window.closeAllTMessages;

    
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

    
    
    
    window.uploadStates = window.uploadStates || {};
    
    
    window.formatFileSize = function(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    
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
    
    
    window.updateImageProgress = function(uploadId, fileId, progress) {
        const pictureList = document.getElementById(uploadId + '-picture-list');
        const item = pictureList.querySelector(`[data-file-id="${fileId}"]`);
        if (!item) return;
        
        const progressBar = item.querySelector('.t-upload__picture-progress-bar');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    };
    
    
    window.handleAvatarSelect = function(uploadId, file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('请选择图片文件');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById(uploadId + '-preview');
            preview.src = e.target.result;
            
            
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
    
    
    window.updateFileItemProgress = function(uploadId, fileId, progress) {
        const list = document.getElementById(uploadId + '-list');
        const item = list.querySelector(`[data-file-id="${fileId}"]`);
        if (!item) return;
        
        const progressBar = item.querySelector('.t-upload__file-progress-bar');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    };
    
    
    window.clearUpload = function(uploadId) {
        window.uploadStates[uploadId] = { files: [] };
        const list = document.getElementById(uploadId + '-list');
        if (list) {
            list.innerHTML = '';
        }
    };
    
    
    window.handleMultiFileSelect = function(uploadId, files) {
        if (!window.uploadStates[uploadId]) {
            window.uploadStates[uploadId] = { files: [] };
        }
        
        const state = window.uploadStates[uploadId];
        const table = document.getElementById(uploadId + '-table');
        const tbody = table.querySelector('tbody');
        const empty = document.getElementById(uploadId + '-empty');
        
        table.style.display = 'block';
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

    
    
    
    window.toggleSelectAll = function() {
        const selectAllCheckbox = document.getElementById('selectAll');
        if (!selectAllCheckbox) return;
        const rowCheckboxes = document.querySelectorAll('.row-checkbox');
        rowCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
    };

    
    
    
    window.uploadStates = {};

    
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

    
    window.formatFileSize = function(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    
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

    
    window.updateImageProgress = function(uploadId, fileId, progress) {
        const pictureList = document.getElementById(uploadId + '-picture-list');
        const item = pictureList.querySelector(`[data-file-id="${fileId}"]`);
        if (!item) return;
        
        const progressBar = item.querySelector('.t-upload__picture-progress-bar');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    };

    
    window.handleAvatarSelect = function(uploadId, file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('请选择图片文件');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById(uploadId + '-preview');
            preview.src = e.target.result;
            
            
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

    
    window.updateFileItemProgress = function(uploadId, fileId, progress) {
        const list = document.getElementById(uploadId + '-list');
        const item = list.querySelector(`[data-file-id="${fileId}"]`);
        if (!item) return;
        
        const progressBar = item.querySelector('.t-upload__file-progress-bar');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    };

    
    window.clearUpload = function(uploadId) {
        window.uploadStates[uploadId] = { files: [] };
        const list = document.getElementById(uploadId + '-list');
        if (list) {
            list.innerHTML = '';
        }
    };

    
    window.handleMultiFileSelect = function(uploadId, files) {
        if (!window.uploadStates[uploadId]) {
            window.uploadStates[uploadId] = { files: [] };
        }
        
        const state = window.uploadStates[uploadId];
        const table = document.getElementById(uploadId + '-table');
        const tbody = table.querySelector('tbody');
        const empty = document.getElementById(uploadId + '-empty');
        
        table.style.display = 'block';
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

    
    window.toggleTreeRow = function(icon) {
        const row = icon.closest('tr');
        if (!row) return;
        const isExpanded = icon.textContent === '▼';
        icon.textContent = isExpanded ? '▶' : '▼';
        
        
        let nextRow = row.nextElementSibling;
        while (nextRow && nextRow.classList.contains('t-table__tree-child')) {
            nextRow.style.display = isExpanded ? 'none' : 'table-row';
            nextRow = nextRow.nextElementSibling;
        }
    };

    return {
        version: '1.1.0',
        
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
        
        utils: {
            debounce,
            throttle,
            isInViewport
        },
        
        init
    };
    
}));
