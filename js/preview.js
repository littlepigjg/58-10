const PreviewRenderer = (() => {

    let iframeEl = null;
    let containerEl = null;
    let currentView = 'desktop';
    let currentBlocks = [];
    let currentGlobalConfig = null;

    function init(iframeSelector, containerSelector) {
        iframeEl = document.querySelector(iframeSelector);
        containerEl = document.querySelector(containerSelector);
    }

    function render(blocks, globalConfig) {
        if (!iframeEl) return;
        currentBlocks = blocks || currentBlocks;
        currentGlobalConfig = globalConfig || currentGlobalConfig;
        const html = TemplateEngine.renderFullHtml(currentBlocks, currentGlobalConfig);
        const doc = iframeEl.contentDocument || iframeEl.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();
    }

    function updateGlobalConfig(globalConfig) {
        if (!iframeEl) return;
        currentGlobalConfig = globalConfig;
        const html = TemplateEngine.renderFullHtml(currentBlocks, currentGlobalConfig);
        const doc = iframeEl.contentDocument || iframeEl.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();
    }

    function setView(view) {
        currentView = view;
        if (containerEl) {
            containerEl.classList.remove('view-desktop', 'view-mobile');
            containerEl.classList.add('view-' + view);
        }
    }

    function getView() {
        return currentView;
    }

    return {
        init,
        render,
        updateGlobalConfig,
        setView,
        getView
    };
})();
