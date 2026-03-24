class d {
  constructor() {
    this.platform = "web";
  }
  /**
   * 创建DOM元素
   * @param tag 标签名
   * @param options 选项
   */
  createElement(t, e = {}) {
    const s = document.createElement(t);
    return e.className && (s.className = e.className), e.id && (s.id = e.id), e.style && Object.assign(s.style, e.style), e.attributes && Object.entries(e.attributes).forEach(([i, r]) => {
      s.setAttribute(i, r);
    }), s;
  }
  /**
   * 获取元素
   * @param selector 选择器
   */
  querySelector(t) {
    return document.querySelector(t);
  }
  /**
   * 获取多个元素
   * @param selector 选择器
   */
  querySelectorAll(t) {
    return Array.from(document.querySelectorAll(t));
  }
  /**
   * 添加事件监听
   * @param element 元素
   * @param event 事件名
   * @param handler 事件处理函数
   */
  addEventListener(t, e, s) {
    t.addEventListener(e, s);
  }
  /**
   * 移除事件监听
   * @param element 元素
   * @param event 事件名
   * @param handler 事件处理函数
   */
  removeEventListener(t, e, s) {
    t.removeEventListener(e, s);
  }
  /**
   * 设置元素属性
   * @param element 元素
   * @param key 属性名
   * @param value 属性值
   */
  setAttribute(t, e, s) {
    t.setAttribute(e, s);
  }
  /**
   * 获取元素属性
   * @param element 元素
   * @param key 属性名
   */
  getAttribute(t, e) {
    return t.getAttribute(e);
  }
  /**
   * 添加样式类
   * @param element 元素
   * @param className 类名
   */
  addClass(t, e) {
    t.classList.add(e);
  }
  /**
   * 移除样式类
   * @param element 元素
   * @param className 类名
   */
  removeClass(t, e) {
    t.classList.remove(e);
  }
  /**
   * 切换样式类
   * @param element 元素
   * @param className 类名
   * @param force 是否强制添加/移除
   */
  toggleClass(t, e, s) {
    return t.classList.toggle(e, s);
  }
  /**
   * 设置样式
   * @param element 元素
   * @param style 样式对象
   */
  setStyle(t, e) {
    Object.assign(t.style, e);
  }
  /**
   * 创建文本节点
   * @param text 文本内容
   */
  createTextNode(t) {
    return document.createTextNode(t);
  }
  /**
   * 添加子元素
   * @param parent 父元素
   * @param child 子元素
   */
  appendChild(t, e) {
    t.appendChild(e);
  }
  /**
   * 移除子元素
   * @param parent 父元素
   * @param child 子元素
   */
  removeChild(t, e) {
    t.removeChild(e);
  }
  /**
   * 获取父元素
   * @param element 元素
   */
  getParent(t) {
    return t.parentElement;
  }
  /**
   * 获取子元素
   * @param element 元素
   */
  getChildren(t) {
    return Array.from(t.children);
  }
  /**
   * 显示元素
   * @param element 元素
   */
  show(t) {
    t.style.display = "";
  }
  /**
   * 隐藏元素
   * @param element 元素
   */
  hide(t) {
    t.style.display = "none";
  }
  /**
   * 获取元素尺寸
   * @param element 元素
   */
  getBoundingClientRect(t) {
    return t.getBoundingClientRect();
  }
  /**
   * 获取窗口尺寸
   */
  getWindowSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
  /**
   * 动画
   * @param element 元素
   * @param props 属性
   * @param duration 持续时间
   * @param callback 回调函数
   */
  animate(t, e, s, i) {
    Object.assign(t.style, {
      transition: `all ${s}ms ease`
    }), Object.assign(t.style, e), setTimeout(() => {
      t.style.transition = "", i == null || i();
    }, s);
  }
  /**
   * 定时器
   * @param callback 回调函数
   * @param delay 延迟时间
   */
  setTimeout(t, e) {
    return window.setTimeout(t, e);
  }
  /**
   * 清除定时器
   * @param timerId 定时器ID
   */
  clearTimeout(t) {
    window.clearTimeout(t);
  }
  /**
   * 防抖函数
   * @param fn 函数
   * @param delay 延迟时间
   */
  debounce(t, e) {
    let s = null;
    return function(...i) {
      s && clearTimeout(s), s = setTimeout(() => {
        t.apply(this, i);
      }, e);
    };
  }
  /**
   * 节流函数
   * @param fn 函数
   * @param interval 间隔时间
   */
  throttle(t, e) {
    let s = 0;
    return function(...i) {
      const r = Date.now();
      r - s >= e && (s = r, t.apply(this, i));
    };
  }
}
class p {
  constructor() {
    this.platform = "wechat";
  }
  /**
   * 创建DOM元素
   * @param tag 标签名
   * @param options 选项
   */
  createElement(t, e = {}) {
    return {
      tag: t,
      className: e.className || "",
      id: e.id || "",
      style: e.style || {},
      attributes: e.attributes || {},
      children: []
    };
  }
  /**
   * 获取元素
   * @param selector 选择器
   */
  querySelector(t) {
    return new Promise((e) => {
      wx.createSelectorQuery().select(t).boundingClientRect().exec((s) => {
        e(s[0]);
      });
    });
  }
  /**
   * 获取多个元素
   * @param selector 选择器
   */
  querySelectorAll(t) {
    return [];
  }
  /**
   * 添加事件监听
   * @param element 元素
   * @param event 事件名
   * @param handler 事件处理函数
   */
  addEventListener(t, e, s) {
    console.log("Add event listener:", e);
  }
  /**
   * 移除事件监听
   * @param element 元素
   * @param event 事件名
   * @param handler 事件处理函数
   */
  removeEventListener(t, e, s) {
    console.log("Remove event listener:", e);
  }
  /**
   * 设置元素属性
   * @param element 元素
   * @param key 属性名
   * @param value 属性值
   */
  setAttribute(t, e, s) {
    t && (t[e] = s);
  }
  /**
   * 获取元素属性
   * @param element 元素
   * @param key 属性名
   */
  getAttribute(t, e) {
    return (t == null ? void 0 : t[e]) || null;
  }
  /**
   * 添加样式类
   * @param element 元素
   * @param className 类名
   */
  addClass(t, e) {
    if (t) {
      t.className = t.className || "";
      const s = t.className.split(" ").filter((i) => i);
      s.includes(e) || (t.className = [...s, e].join(" "));
    }
  }
  /**
   * 移除样式类
   * @param element 元素
   * @param className 类名
   */
  removeClass(t, e) {
    if (t && t.className) {
      const s = t.className.split(" ");
      t.className = s.filter((i) => i !== e).join(" ");
    }
  }
  /**
   * 切换样式类
   * @param element 元素
   * @param className 类名
   * @param force 是否强制添加/移除
   */
  toggleClass(t, e, s) {
    if (!t || !t.className)
      return !1;
    const i = t.className.split(" "), r = i.includes(e);
    return s !== void 0 ? s && !r ? (t.className = [...i, e].join(" "), !0) : !s && r ? (t.className = i.filter((n) => n !== e).join(" "), !1) : r : r ? (t.className = i.filter((n) => n !== e).join(" "), !1) : (t.className = [...i, e].join(" "), !0);
  }
  /**
   * 设置样式
   * @param element 元素
   * @param style 样式对象
   */
  setStyle(t, e) {
    t && (t.style = { ...t.style, ...e });
  }
  /**
   * 创建文本节点
   * @param text 文本内容
   */
  createTextNode(t) {
    return {
      type: "text",
      text: t
    };
  }
  /**
   * 添加子元素
   * @param parent 父元素
   * @param child 子元素
   */
  appendChild(t, e) {
    t && t.children && t.children.push(e);
  }
  /**
   * 移除子元素
   * @param parent 父元素
   * @param child 子元素
   */
  removeChild(t, e) {
    t && t.children && (t.children = t.children.filter((s) => s !== e));
  }
  /**
   * 获取父元素
   * @param element 元素
   */
  getParent(t) {
    return (t == null ? void 0 : t.parent) || null;
  }
  /**
   * 获取子元素
   * @param element 元素
   */
  getChildren(t) {
    return (t == null ? void 0 : t.children) || [];
  }
  /**
   * 显示元素
   * @param element 元素
   */
  show(t) {
    t && (t.hidden = !1);
  }
  /**
   * 隐藏元素
   * @param element 元素
   */
  hide(t) {
    t && (t.hidden = !0);
  }
  /**
   * 获取元素尺寸
   * @param element 元素
   */
  getBoundingClientRect(t) {
    return {
      width: (t == null ? void 0 : t.width) || 0,
      height: (t == null ? void 0 : t.height) || 0,
      top: (t == null ? void 0 : t.top) || 0,
      left: (t == null ? void 0 : t.left) || 0,
      bottom: (t == null ? void 0 : t.bottom) || 0,
      right: (t == null ? void 0 : t.right) || 0
    };
  }
  /**
   * 获取窗口尺寸
   */
  getWindowSize() {
    const t = wx.getSystemInfoSync();
    return {
      width: t.windowWidth,
      height: t.windowHeight
    };
  }
  /**
   * 动画
   * @param element 元素
   * @param props 属性
   * @param duration 持续时间
   * @param callback 回调函数
   */
  animate(t, e, s, i) {
    const r = wx.createAnimation({
      duration: s,
      timingFunction: "ease"
    });
    Object.keys(e).forEach((n) => {
      r[n](e[n]);
    }), setTimeout(() => {
      i == null || i();
    }, s);
  }
  /**
   * 定时器
   * @param callback 回调函数
   * @param delay 延迟时间
   */
  setTimeout(t, e) {
    return setTimeout(t, e);
  }
  /**
   * 清除定时器
   * @param timerId 定时器ID
   */
  clearTimeout(t) {
    clearTimeout(t);
  }
  /**
   * 防抖函数
   * @param fn 函数
   * @param delay 延迟时间
   */
  debounce(t, e) {
    let s = null;
    return function(...i) {
      s && clearTimeout(s), s = setTimeout(() => {
        t.apply(this, i);
      }, e);
    };
  }
  /**
   * 节流函数
   * @param fn 函数
   * @param interval 间隔时间
   */
  throttle(t, e) {
    let s = 0;
    return function(...i) {
      const r = Date.now();
      r - s >= e && (s = r, t.apply(this, i));
    };
  }
}
class m {
  constructor() {
    this.platform = "app";
  }
  /**
   * 创建DOM元素
   * @param tag 标签名
   * @param options 选项
   */
  createElement(t, e = {}) {
    return {
      tag: t,
      className: e.className || "",
      id: e.id || "",
      style: e.style || {},
      attributes: e.attributes || {},
      nativeElement: null
    };
  }
  /**
   * 获取元素
   * @param selector 选择器
   */
  querySelector(t) {
    return console.log("Query selector:", t), null;
  }
  /**
   * 获取多个元素
   * @param selector 选择器
   */
  querySelectorAll(t) {
    return console.log("Query selector all:", t), [];
  }
  /**
   * 添加事件监听
   * @param element 元素
   * @param event 事件名
   * @param handler 事件处理函数
   */
  addEventListener(t, e, s) {
    console.log("Add event listener:", e);
  }
  /**
   * 移除事件监听
   * @param element 元素
   * @param event 事件名
   * @param handler 事件处理函数
   */
  removeEventListener(t, e, s) {
    console.log("Remove event listener:", e);
  }
  /**
   * 设置元素属性
   * @param element 元素
   * @param key 属性名
   * @param value 属性值
   */
  setAttribute(t, e, s) {
    t && (t[e] = s);
  }
  /**
   * 获取元素属性
   * @param element 元素
   * @param key 属性名
   */
  getAttribute(t, e) {
    return (t == null ? void 0 : t[e]) || null;
  }
  /**
   * 添加样式类
   * @param element 元素
   * @param className 类名
   */
  addClass(t, e) {
    if (t) {
      t.className = t.className || "";
      const s = t.className.split(" ").filter((i) => i);
      s.includes(e) || (t.className = [...s, e].join(" "));
    }
  }
  /**
   * 移除样式类
   * @param element 元素
   * @param className 类名
   */
  removeClass(t, e) {
    if (t && t.className) {
      const s = t.className.split(" ");
      t.className = s.filter((i) => i !== e).join(" ");
    }
  }
  /**
   * 切换样式类
   * @param element 元素
   * @param className 类名
   * @param force 是否强制添加/移除
   */
  toggleClass(t, e, s) {
    if (!t || !t.className)
      return !1;
    const i = t.className.split(" "), r = i.includes(e);
    return s !== void 0 ? s && !r ? (t.className = [...i, e].join(" "), !0) : !s && r ? (t.className = i.filter((n) => n !== e).join(" "), !1) : r : r ? (t.className = i.filter((n) => n !== e).join(" "), !1) : (t.className = [...i, e].join(" "), !0);
  }
  /**
   * 设置样式
   * @param element 元素
   * @param style 样式对象
   */
  setStyle(t, e) {
    t && (t.style = { ...t.style, ...e });
  }
  /**
   * 创建文本节点
   * @param text 文本内容
   */
  createTextNode(t) {
    return {
      type: "text",
      text: t
    };
  }
  /**
   * 添加子元素
   * @param parent 父元素
   * @param child 子元素
   */
  appendChild(t, e) {
    console.log("Append child:", e);
  }
  /**
   * 移除子元素
   * @param parent 父元素
   * @param child 子元素
   */
  removeChild(t, e) {
    console.log("Remove child:", e);
  }
  /**
   * 获取父元素
   * @param element 元素
   */
  getParent(t) {
    return (t == null ? void 0 : t.parent) || null;
  }
  /**
   * 获取子元素
   * @param element 元素
   */
  getChildren(t) {
    return (t == null ? void 0 : t.children) || [];
  }
  /**
   * 显示元素
   * @param element 元素
   */
  show(t) {
    console.log("Show element");
  }
  /**
   * 隐藏元素
   * @param element 元素
   */
  hide(t) {
    console.log("Hide element");
  }
  /**
   * 获取元素尺寸
   * @param element 元素
   */
  getBoundingClientRect(t) {
    return {
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    };
  }
  /**
   * 获取窗口尺寸
   */
  getWindowSize() {
    return {
      width: window.innerWidth || 375,
      height: window.innerHeight || 667
    };
  }
  /**
   * 动画
   * @param element 元素
   * @param props 属性
   * @param duration 持续时间
   * @param callback 回调函数
   */
  animate(t, e, s, i) {
    console.log("Animate element:", e), setTimeout(() => {
      i == null || i();
    }, s);
  }
  /**
   * 定时器
   * @param callback 回调函数
   * @param delay 延迟时间
   */
  setTimeout(t, e) {
    return setTimeout(t, e);
  }
  /**
   * 清除定时器
   * @param timerId 定时器ID
   */
  clearTimeout(t) {
    clearTimeout(t);
  }
  /**
   * 防抖函数
   * @param fn 函数
   * @param delay 延迟时间
   */
  debounce(t, e) {
    let s = null;
    return function(...i) {
      s && clearTimeout(s), s = setTimeout(() => {
        t.apply(this, i);
      }, e);
    };
  }
  /**
   * 节流函数
   * @param fn 函数
   * @param interval 间隔时间
   */
  throttle(t, e) {
    let s = 0;
    return function(...i) {
      const r = Date.now();
      r - s >= e && (s = r, t.apply(this, i));
    };
  }
}
class o {
  /**
   * 初始化平台管理器
   * 自动检测当前运行环境并选择合适的适配器
   */
  static init() {
    this.detectPlatform(), this.createAdapter();
  }
  /**
   * 检测当前平台
   */
  static detectPlatform() {
    typeof wx < "u" && typeof wx.getSystemInfoSync == "function" ? this.platform = "wechat" : typeof window < "u" && typeof document < "u" ? this.platform = "web" : this.platform = "app";
  }
  /**
   * 创建平台适配器
   */
  static createAdapter() {
    switch (this.platform) {
      case "web":
        this.adapter = new d();
        break;
      case "wechat":
        this.adapter = new p();
        break;
      case "app":
        this.adapter = new m();
        break;
      default:
        this.adapter = new d();
    }
  }
  /**
   * 获取当前平台类型
   */
  static getPlatform() {
    return this.platform;
  }
  /**
   * 获取平台适配器
   */
  static getAdapter() {
    return this.adapter || this.init(), this.adapter;
  }
  /**
   * 手动设置平台
   * @param platform 平台类型
   */
  static setPlatform(t) {
    this.platform = t, this.createAdapter();
  }
  /**
   * 检查是否为Web平台
   */
  static isWeb() {
    return this.platform === "web";
  }
  /**
   * 检查是否为微信小程序平台
   */
  static isWechat() {
    return this.platform === "wechat";
  }
  /**
   * 检查是否为APP平台
   */
  static isApp() {
    return this.platform === "app";
  }
}
o.platform = "unknown";
o.adapter = null;
class b {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
  }
  /**
   * 订阅事件
   * @param eventName 事件名称
   * @param handler 事件处理函数
   */
  on(t, e) {
    return this.listeners.has(t) || this.listeners.set(t, /* @__PURE__ */ new Set()), this.listeners.get(t).add(e), this;
  }
  /**
   * 订阅事件（仅触发一次）
   * @param eventName 事件名称
   * @param handler 事件处理函数
   */
  once(t, e) {
    const s = (...i) => {
      e(...i), this.off(t, s);
    };
    return this.on(t, s);
  }
  /**
   * 取消订阅事件
   * @param eventName 事件名称
   * @param handler 事件处理函数（可选，不传则取消所有该事件的订阅）
   */
  off(t, e) {
    return this.listeners.has(t) ? (e ? (this.listeners.get(t).delete(e), this.listeners.get(t).size === 0 && this.listeners.delete(t)) : this.listeners.delete(t), this) : this;
  }
  /**
   * 发布事件
   * @param eventName 事件名称
   * @param args 事件参数
   */
  emit(t, ...e) {
    return this.listeners.has(t) ? (this.listeners.get(t).forEach((i) => {
      try {
        i(...e);
      } catch (r) {
        console.error(`Error in event handler for ${t}:`, r);
      }
    }), !0) : !1;
  }
  /**
   * 获取事件的监听器数量
   * @param eventName 事件名称
   */
  listenerCount(t) {
    return this.listeners.has(t) ? this.listeners.get(t).size : 0;
  }
  /**
   * 获取所有事件名称
   */
  eventNames() {
    return Array.from(this.listeners.keys());
  }
  /**
   * 清除所有事件监听器
   */
  removeAllListeners() {
    return this.listeners.clear(), this;
  }
}
class u {
  /**
   * 构造函数
   * @param id 组件ID
   * @param type 组件类型
   * @param props 组件属性
   */
  constructor(t, e, s = {}) {
    this.props = {}, this.state = {}, this.adapter = o.getAdapter(), this.eventEmitter = new b(), this.id = t, this.type = e, this.props = s;
  }
  /**
   * 组件生命周期钩子 - 创建前
   */
  beforeCreate() {
  }
  /**
   * 组件生命周期钩子 - 创建后
   */
  created() {
  }
  /**
   * 组件生命周期钩子 - 挂载前
   */
  beforeMount() {
  }
  /**
   * 组件生命周期钩子 - 挂载后
   */
  mounted() {
  }
  /**
   * 组件生命周期钩子 - 更新前
   */
  beforeUpdate() {
  }
  /**
   * 组件生命周期钩子 - 更新后
   */
  updated() {
  }
  /**
   * 组件生命周期钩子 - 销毁前
   */
  beforeDestroy() {
  }
  /**
   * 组件生命周期钩子 - 销毁后
   */
  destroyed() {
  }
  /**
   * 初始化组件（完整生命周期流程）
   */
  init() {
    this.beforeCreate(), this.created(), this.beforeMount(), this.mounted();
  }
  /**
   * 销毁组件（完整生命周期流程）
   */
  destroy() {
    this.beforeDestroy(), this.destroyed();
  }
  /**
   * 更新组件属性（带生命周期钩子）
   * @param props 新的属性
   */
  updateProps(t) {
    this.beforeUpdate(), this.props = { ...this.props, ...t }, this.updated();
  }
  /**
   * 更新组件状态（带生命周期钩子）
   * @param state 新的状态
   */
  updateState(t) {
    this.beforeUpdate(), this.state = { ...this.state, ...t }, this.updated();
  }
  /**
   * 获取元素
   * @param selector 选择器
   */
  getElement(t) {
    return this.adapter.querySelector(t);
  }
  /**
   * 获取多个元素
   * @param selector 选择器
   */
  getElements(t) {
    return this.adapter.querySelectorAll(t);
  }
  /**
   * 创建元素
   * @param tag 标签名
   * @param options 选项
   */
  createElement(t, e = {}) {
    return this.adapter.createElement(t, e);
  }
  /**
   * 添加事件监听
   * @param element 元素
   * @param event 事件名
   * @param handler 事件处理函数
   */
  addEventListener(t, e, s) {
    this.adapter.addEventListener(t, e, s);
  }
  /**
   * 移除事件监听
   * @param element 元素
   * @param event 事件名
   * @param handler 事件处理函数
   */
  removeEventListener(t, e, s) {
    this.adapter.removeEventListener(t, e, s);
  }
  /**
   * 设置元素属性
   * @param element 元素
   * @param key 属性名
   * @param value 属性值
   */
  setAttribute(t, e, s) {
    this.adapter.setAttribute(t, e, s);
  }
  /**
   * 获取元素属性
   * @param element 元素
   * @param key 属性名
   */
  getAttribute(t, e) {
    return this.adapter.getAttribute(t, e);
  }
  /**
   * 添加样式类
   * @param element 元素
   * @param className 类名
   */
  addClass(t, e) {
    this.adapter.addClass(t, e);
  }
  /**
   * 移除样式类
   * @param element 元素
   * @param className 类名
   */
  removeClass(t, e) {
    this.adapter.removeClass(t, e);
  }
  /**
   * 切换样式类
   * @param element 元素
   * @param className 类名
   * @param force 是否强制添加/移除
   */
  toggleClass(t, e, s) {
    return this.adapter.toggleClass(t, e, s);
  }
  /**
   * 设置样式
   * @param element 元素
   * @param style 样式对象
   */
  setStyle(t, e) {
    this.adapter.setStyle(t, e);
  }
  /**
   * 创建文本节点
   * @param text 文本内容
   */
  createTextNode(t) {
    return this.adapter.createTextNode(t);
  }
  /**
   * 添加子元素
   * @param parent 父元素
   * @param child 子元素
   */
  appendChild(t, e) {
    this.adapter.appendChild(t, e);
  }
  /**
   * 移除子元素
   * @param parent 父元素
   * @param child 子元素
   */
  removeChild(t, e) {
    this.adapter.removeChild(t, e);
  }
  /**
   * 获取父元素
   * @param element 元素
   */
  getParent(t) {
    return this.adapter.getParent(t);
  }
  /**
   * 获取子元素
   * @param element 元素
   */
  getChildren(t) {
    return this.adapter.getChildren(t);
  }
  /**
   * 显示元素
   * @param element 元素
   */
  show(t) {
    this.adapter.show(t);
  }
  /**
   * 隐藏元素
   * @param element 元素
   */
  hide(t) {
    this.adapter.hide(t);
  }
  /**
   * 获取元素尺寸
   * @param element 元素
   */
  getBoundingClientRect(t) {
    return this.adapter.getBoundingClientRect(t);
  }
  /**
   * 获取窗口尺寸
   */
  getWindowSize() {
    return this.adapter.getWindowSize();
  }
  /**
   * 动画
   * @param element 元素
   * @param props 属性
   * @param duration 持续时间
   * @param callback 回调函数
   */
  animate(t, e, s, i) {
    this.adapter.animate(t, e, s, i);
  }
  /**
   * 定时器
   * @param callback 回调函数
   * @param delay 延迟时间
   */
  setTimeout(t, e) {
    return this.adapter.setTimeout(t, e);
  }
  /**
   * 清除定时器
   * @param timerId 定时器ID
   */
  clearTimeout(t) {
    this.adapter.clearTimeout(t);
  }
  /**
   * 防抖函数
   * @param fn 函数
   * @param delay 延迟时间
   */
  debounce(t, e) {
    return this.adapter.debounce(t, e);
  }
  /**
   * 节流函数
   * @param fn 函数
   * @param interval 间隔时间
   */
  throttle(t, e) {
    return this.adapter.throttle(t, e);
  }
  /**
   * 订阅事件
   * @param eventName 事件名称
   * @param handler 事件处理函数
   */
  on(t, e) {
    return this.eventEmitter.on(t, e), this;
  }
  /**
   * 订阅事件（仅触发一次）
   * @param eventName 事件名称
   * @param handler 事件处理函数
   */
  once(t, e) {
    return this.eventEmitter.once(t, e), this;
  }
  /**
   * 取消订阅事件
   * @param eventName 事件名称
   * @param handler 事件处理函数（可选）
   */
  off(t, e) {
    return this.eventEmitter.off(t, e), this;
  }
  /**
   * 发布事件
   * @param eventName 事件名称
   * @param args 事件参数
   */
  emit(t, ...e) {
    return this.eventEmitter.emit(t, ...e);
  }
  /**
   * 获取事件监听器数量
   * @param eventName 事件名称
   */
  listenerCount(t) {
    return this.eventEmitter.listenerCount(t);
  }
  /**
   * 获取所有事件名称
   */
  eventNames() {
    return this.eventEmitter.eventNames();
  }
  /**
   * 清除所有事件监听器
   */
  removeAllListeners() {
    return this.eventEmitter.removeAllListeners(), this;
  }
}
class c extends u {
  /**
   * 构造函数
   * @param id 组件ID
   * @param props 组件属性
   */
  constructor(t, e = {}) {
    super(t, "radio", e);
  }
  /**
   * 组件挂载后钩子
   */
  mounted() {
    this.initRadioElements(), this.initRadioButtons();
  }
  /**
   * 初始化 Radio 元素
   */
  initRadioElements() {
    this.getElements(".t-radio__input").forEach((e) => {
      this.updateCheckedState(e), this.addEventListener(e, "change", () => {
        e.name ? this.getElements(`input[name="${e.name}"]`).forEach((s) => {
          this.updateCheckedState(s);
        }) : this.updateCheckedState(e);
      });
    });
  }
  /**
   * 初始化 Radio Button 元素
   */
  initRadioButtons() {
    this.getElements(".t-radio-button").forEach((e) => {
      this.addEventListener(e, "click", () => {
        var i, r;
        const s = ((r = (i = e.parentElement) == null ? void 0 : i.dataset) == null ? void 0 : r.group) || "default";
        this.selectButton(e, s);
      });
    });
  }
  /**
   * 更新 Radio 选中状态
   * @param radio radio输入元素
   */
  updateCheckedState(t) {
    const e = this.getParent(t);
    if (e && e.classList && e.classList.contains && e.classList.contains("t-radio")) {
      const s = t.checked;
      this.toggleClass(e, "is-checked", s), this.setAttribute(e, "aria-checked", s.toString()), s && t.name && this.getElements(`input[name="${t.name}"]`).forEach((i) => {
        if (i !== t) {
          const r = this.getParent(i);
          r && r.classList && r.classList.contains && r.classList.contains("t-radio") && (this.removeClass(r, "is-checked"), this.setAttribute(r, "aria-checked", "false"));
        }
      }), this.emit("t:radio:change", {
        value: t.value,
        group: t.name || "default",
        checked: s
      });
    }
  }
  /**
   * 选择 Radio Button 样式
   * @param button 按钮元素
   * @param groupName 组名
   */
  selectButton(t, e) {
    var i;
    const s = this.getParent(t);
    s && (this.getChildren(s).forEach((n) => {
      n.classList && n.classList.contains && n.classList.contains("t-radio-button") && (this.removeClass(n, "is-active"), this.setAttribute(n, "aria-checked", "false"));
    }), this.addClass(t, "is-active"), this.setAttribute(t, "aria-checked", "true"), this.emit("t:radio:change", {
      value: ((i = t.dataset) == null ? void 0 : i.value) || t.textContent,
      group: e,
      checked: !0
    }));
  }
  /**
   * 选择 Radio Button 样式（兼容旧版调用方式）
   * @param button 按钮元素
   * @param groupName 组名
   */
  selectRadioButton(t, e) {
    this.selectButton(t, e);
  }
}
class h extends u {
  /**
   * 构造函数
   * @param id 组件ID
   * @param props 组件属性
   */
  constructor(t, e = {}) {
    super(t, "checkbox", e);
  }
  /**
   * 组件挂载后钩子
   */
  mounted() {
    this.initCheckboxElements(), this.initCheckboxButtons();
  }
  /**
   * 初始化 Checkbox 元素
   */
  initCheckboxElements() {
    this.getElements(".t-checkbox__input").forEach((e) => {
      this.updateCheckedState(e), this.addEventListener(e, "change", () => {
        this.updateCheckedState(e);
        let s = this.getParent(e);
        for (; s; ) {
          if (s.dataset && s.dataset.checkboxGroup) {
            this.updateCheckAllState(`[data-checkbox-group="${s.dataset.checkboxGroup}"]`);
            break;
          }
          s = this.getParent(s);
        }
      });
    });
  }
  /**
   * 初始化 Checkbox Button 元素
   */
  initCheckboxButtons() {
    this.getElements(".t-checkbox-button").forEach((e) => {
      this.addEventListener(e, "click", () => {
        this.toggleButton(e);
      });
    });
  }
  /**
   * 更新 Checkbox 选中状态
   * @param checkbox checkbox输入元素
   */
  updateCheckedState(t) {
    const e = this.getParent(t);
    if (e && e.classList && e.classList.contains && e.classList.contains("t-checkbox") && !e.classList.contains("is-disabled")) {
      const s = t.checked;
      this.toggleClass(e, "is-checked", s), this.setAttribute(e, "aria-checked", s.toString()), this.emit("t:checkbox:change", {
        value: t.value,
        checked: s,
        name: t.name || "default"
      });
    }
  }
  /**
   * 切换 Checkbox Button 状态
   * @param button 按钮元素
   */
  toggleButton(t) {
    var s;
    if (t.classList && t.classList.contains && t.classList.contains("is-disabled"))
      return;
    const e = this.toggleClass(t, "is-active");
    this.setAttribute(t, "aria-pressed", e.toString()), this.emit("t:checkbox:change", {
      value: ((s = t.dataset) == null ? void 0 : s.value) || t.textContent,
      checked: e,
      name: "button"
    });
  }
  /**
   * 切换 Checkbox Button 状态（兼容旧版调用方式）
   * @param button 按钮元素
   */
  toggleCheckboxButton(t) {
    this.toggleButton(t);
  }
  /**
   * 切换全选状态（兼容旧版调用方式 - checkbox-cities-group）
   */
  toggleCheckAll() {
    const t = this.getElementById("checkbox-all-input"), e = this.getElements(".city-checkbox");
    if (t && e.length > 0) {
      const i = t.checked;
      e.forEach((r) => {
        r.checked = !i, this.updateCheckedState(r);
      }), t.checked = !i, this.updateCheckedState(t);
      return;
    }
    const s = this.getElement(".t-checkbox.is-indeterminate, .t-checkbox[data-check-all]");
    if (s) {
      let i = this.getParent(s);
      for (; i; ) {
        if (i.classList && i.classList.contains && i.classList.contains("t-checkbox-group")) {
          this.toggleCheckAllBySelector("#" + i.id);
          break;
        }
        i = this.getParent(i);
      }
    }
  }
  /**
   * 切换全选状态（通过选择器）
   * @param groupSelector 分组选择器
   */
  toggleCheckAllBySelector(t) {
    const e = this.getElement(`${t} .t-checkbox.is-indeterminate, ${t} [data-check-all]`);
    if (!e)
      return;
    const s = e.querySelector ? e.querySelector('input[type="checkbox"]') : null, i = this.getElements(`${t} .t-checkbox:not([data-check-all]) input[type="checkbox"]`);
    e.classList && e.classList.contains && e.classList.contains("is-indeterminate") && this.removeClass(e, "is-indeterminate"), s && (s.checked = !s.checked, i.forEach((r) => {
      r.checked = s.checked, this.updateCheckedState(r);
    }), this.updateCheckedState(s));
  }
  /**
   * 更新全选状态
   * @param groupSelector 分组选择器
   */
  updateCheckAllState(t) {
    const e = this.getElement(`${t} [data-check-all]`);
    if (!e)
      return;
    const s = e.querySelector ? e.querySelector('input[type="checkbox"]') : null, i = this.getElements(`${t} .t-checkbox:not([data-check-all]) input[type="checkbox"]`);
    if (!s)
      return;
    const r = i.filter((f) => f.checked).length, n = i.length;
    e.classList && this.removeClass(e, "is-indeterminate"), r === 0 ? s.checked = !1 : r === n ? s.checked = !0 : (s.checked = !1, e.classList && this.addClass(e, "is-indeterminate")), this.updateCheckedState(s);
  }
  /**
   * 通过ID获取元素
   * @param id 元素ID
   */
  getElementById(t) {
    return this.getElement(`#${t}`);
  }
}
class C {
  /**
   * 构造函数
   * @param context 插件上下文
   */
  constructor(t) {
    this.plugins = /* @__PURE__ */ new Map(), this.enabledPlugins = /* @__PURE__ */ new Set(), this.context = t;
  }
  /**
   * 注册插件
   * @param plugin 插件对象
   */
  register(t) {
    if (!t.name)
      throw new Error("Plugin must have a name");
    return this.plugins.has(t.name) ? (console.warn(`Plugin "${t.name}" is already registered`), this) : (this.plugins.set(t.name, t), typeof t.install == "function" && t.install(this.context), this);
  }
  /**
   * 启用插件
   * @param pluginName 插件名称
   */
  enable(t) {
    const e = this.plugins.get(t);
    return e ? this.enabledPlugins.has(t) ? (console.warn(`Plugin "${t}" is already enabled`), !0) : (typeof e.enable == "function" && e.enable(), this.enabledPlugins.add(t), !0) : (console.error(`Plugin "${t}" is not registered`), !1);
  }
  /**
   * 禁用插件
   * @param pluginName 插件名称
   */
  disable(t) {
    const e = this.plugins.get(t);
    return e ? this.enabledPlugins.has(t) ? (typeof e.disable == "function" && e.disable(), this.enabledPlugins.delete(t), !0) : (console.warn(`Plugin "${t}" is not enabled`), !0) : (console.error(`Plugin "${t}" is not registered`), !1);
  }
  /**
   * 获取插件
   * @param pluginName 插件名称
   */
  getPlugin(t) {
    return this.plugins.get(t);
  }
  /**
   * 获取所有注册的插件
   */
  getAllPlugins() {
    return Array.from(this.plugins.values());
  }
  /**
   * 获取已启用的插件
   */
  getEnabledPlugins() {
    return Array.from(this.enabledPlugins).map((t) => this.plugins.get(t)).filter(Boolean);
  }
  /**
   * 检查插件是否已注册
   * @param pluginName 插件名称
   */
  hasPlugin(t) {
    return this.plugins.has(t);
  }
  /**
   * 检查插件是否已启用
   * @param pluginName 插件名称
   */
  isEnabled(t) {
    return this.enabledPlugins.has(t);
  }
  /**
   * 销毁所有插件
   */
  destroy() {
    this.enabledPlugins.forEach((t) => {
      this.disable(t);
    }), this.plugins.forEach((t) => {
      typeof t.destroy == "function" && t.destroy();
    }), this.plugins.clear(), this.enabledPlugins.clear();
  }
}
o.init();
const l = class {
  /**
   * 初始化所有组件
   */
  static init() {
    new c("radio").init(), new h("checkbox").init();
  }
  /**
   * 获取当前平台类型
   */
  static getPlatform() {
    return o.getPlatform();
  }
  /**
   * 手动设置平台
   * @param platform 平台类型
   */
  static setPlatform(t) {
    o.setPlatform(t);
  }
  /**
   * 注册插件
   * @param plugin 插件对象
   */
  static use(t) {
    return this.Plugin.register(t), this;
  }
  /**
   * 启用插件
   * @param pluginName 插件名称
   */
  static enablePlugin(t) {
    return this.Plugin.enable(t);
  }
  /**
   * 禁用插件
   * @param pluginName 插件名称
   */
  static disablePlugin(t) {
    return this.Plugin.disable(t);
  }
  /**
   * 获取插件
   * @param pluginName 插件名称
   */
  static getPlugin(t) {
    return this.Plugin.getPlugin(t);
  }
  /**
   * 获取所有插件
   */
  static getAllPlugins() {
    return this.Plugin.getAllPlugins();
  }
};
l.Platform = o;
l.Plugin = new C(l);
l.Components = {
  Radio: c,
  Checkbox: h
  // 后续会添加更多组件
};
l.Radio = c;
l.Checkbox = h;
let g = l;
typeof window < "u" && (window.TbeUI = g);
typeof module < "u" && module.exports && (module.exports = g);
export {
  g as default
};
//# sourceMappingURL=tbeui.esm.js.map
