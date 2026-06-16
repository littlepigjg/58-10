const TemplateEngine = (() => {

    function escapeHtml(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function isFieldExplicitlySet(block, fieldKey) {
        if (!block || !block.data) return false;
        return block.data.hasOwnProperty(fieldKey) && block.data[fieldKey] !== undefined && block.data[fieldKey] !== null && block.data[fieldKey] !== '';
    }

    function getStyleValue(block, fieldKey, fallbackVar, fallbackValue) {
        if (isFieldExplicitlySet(block, fieldKey)) {
            return block.data[fieldKey];
        }
        if (fallbackVar) {
            return 'var(' + fallbackVar + ', ' + fallbackValue + ')';
        }
        return fallbackValue;
    }

    function getPaddingStyle(block) {
        var d = block.data || {};
        var mapping = GlobalStyleMapping.fieldToCssVar[block.type] || {};
        var top = isFieldExplicitlySet(block, 'paddingTop') ? d.paddingTop : 'var(--default-padding-top, 0)';
        var right = isFieldExplicitlySet(block, 'paddingRight') ? d.paddingRight : 'var(--default-padding-right, 20)';
        var bottom = isFieldExplicitlySet(block, 'paddingBottom') ? d.paddingBottom : 'var(--default-padding-bottom, 0)';
        var left = isFieldExplicitlySet(block, 'paddingLeft') ? d.paddingLeft : 'var(--default-padding-left, 20)';
        return 'padding: ' + top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px;';
    }

    function buildCssVariables(globalConfig) {
        if (!globalConfig) return '';
        var vars = [];
        var map = GlobalStyleMapping.cssVarMap;
        Object.keys(map).forEach(function(key) {
            if (globalConfig[key] !== undefined && globalConfig[key] !== null) {
                var val = globalConfig[key];
                if (typeof val === 'number' && (key.indexOf('FontSize') !== -1 || key.indexOf('Padding') !== -1)) {
                    val = val + 'px';
                }
                vars.push(map[key] + ': ' + val + ';');
            }
        });
        if (vars.length === 0) return '';
        return ':root {\n        ' + vars.join('\n        ') + '\n    }\n';
    }

    function resolveBackgroundColor(block) {
        return getStyleValue(block, 'backgroundColor', '--primary-color', '#667eea');
    }

    function resolveTextColor(block) {
        var mapping = GlobalStyleMapping.fieldToCssVar[block.type] || {};
        var cssVar = mapping.color || '--text-color';
        var defaults = {
            heading: '#1f2937',
            paragraph: '#4b5563',
            button: '#ffffff',
            divider: '#e5e7eb'
        };
        return getStyleValue(block, 'color', cssVar, defaults[block.type] || '#333333');
    }

    function resolveFontSize(block) {
        var mapping = GlobalStyleMapping.fieldToCssVar[block.type] || {};
        var cssVar = mapping.fontSize || '--body-font-size';
        var defaults = {
            heading: 28,
            paragraph: 14,
            button: 15
        };
        return getStyleValue(block, 'fontSize', cssVar, defaults[block.type] || 14);
    }

    function resolveFontFamily(block) {
        var mapping = GlobalStyleMapping.fieldToCssVar[block.type] || {};
        var cssVar = mapping.fontFamily || '--default-font-family';
        var fallback = '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial, sans-serif';
        if (isFieldExplicitlySet(block, 'fontFamily')) {
            return block.data.fontFamily;
        }
        return 'var(' + cssVar + ', ' + fallback + ')';
    }

    function resolveDividerColor(block) {
        return getStyleValue(block, 'color', '--divider-color', '#e5e7eb');
    }

    function resolveButtonBgColor(block) {
        return getStyleValue(block, 'backgroundColor', '--primary-color', '#667eea');
    }

    function getFontSizeUnit(val) {
        if (typeof val === 'number') return val + 'px';
        return val;
    }

    function renderHeading(block) {
        var d = block.data;
        var tag = 'h' + (d.level || 1);
        var align = d.align || 'center';
        var fontSize = resolveFontSize(block);
        var color = resolveTextColor(block);
        var fontWeight = d.fontWeight || 'bold';
        var fontFamily = resolveFontFamily(block);
        var text = escapeHtml(d.text);
        var style = getPaddingStyle(block);

        return '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="' + style + '">' +
            '<tr><td align="' + align + '">' +
                '<' + tag + ' style="margin:0;font-size:' + getFontSizeUnit(fontSize) + ';color:' + color + ';font-weight:' + fontWeight + ';line-height:1.3;font-family: ' + fontFamily + ';">' + text + '</' + tag + '>' +
            '</td></tr></table>';
    }

    function renderParagraph(block) {
        var d = block.data;
        var align = d.align || 'left';
        var fontSize = resolveFontSize(block);
        var lineHeight = d.lineHeight || 1.6;
        var color = resolveTextColor(block);
        var fontFamily = resolveFontFamily(block);
        var text = escapeHtml(d.text).replace(/\n/g, '<br>');
        var style = getPaddingStyle(block);

        return '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="' + style + '">' +
            '<tr><td align="' + align + '">' +
                '<p style="margin:0;font-size:' + getFontSizeUnit(fontSize) + ';line-height:' + lineHeight + ';color:' + color + ';font-family: ' + fontFamily + ';">' + text + '</p>' +
            '</td></tr></table>';
    }

    function renderImage(block) {
        var d = block.data;
        var align = d.align || 'center';
        var width = d.width || 100;
        var src = escapeHtml(d.src);
        var alt = escapeHtml(d.alt || '');
        var href = d.href ? escapeHtml(d.href) : '';
        var style = getPaddingStyle(block);

        var imgHtml = '<img src="' + src + '" alt="' + alt + '" style="display:block;max-width:100%;width:' + width + '%;height:auto;border:0;outline:none;text-decoration:none;" width="' + width + '%" />';
        if (href) {
            imgHtml = '<a href="' + href + '" target="_blank" style="text-decoration:none;">' + imgHtml + '</a>';
        }

        return '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="' + style + '">' +
            '<tr><td align="' + align + '">' + imgHtml + '</td></tr></table>';
    }

    function renderButton(block) {
        var d = block.data;
        var bgColor = resolveButtonBgColor(block);
        var textColor = resolveTextColor(block);
        var borderRadius = d.borderRadius || 6;
        var padV = d.paddingVertical || 12;
        var padH = d.paddingHorizontal || 28;
        var fontSize = resolveFontSize(block);
        var fontWeight = d.fontWeight || 'bold';
        var fontFamily = resolveFontFamily(block);
        var btnHref = escapeHtml(d.href || '#');
        var btnText = escapeHtml(d.text);
        var align = d.align || 'center';
        var style = getPaddingStyle(block);

        return '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="' + style + '">' +
            '<tr><td align="' + align + '">' +
                '<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate !important;">' +
                    '<tr><td style="border-radius:' + borderRadius + 'px;background-color:' + bgColor + ';">' +
                        '<a href="' + btnHref + '" target="_blank" style="display:inline-block;padding:' + padV + 'px ' + padH + 'px;border-radius:' + borderRadius + 'px;background:' + bgColor + ';color:' + textColor + ';text-decoration:none;font-size:' + getFontSizeUnit(fontSize) + ';font-weight:' + fontWeight + ';font-family: ' + fontFamily + ';">' + btnText + '</a>' +
                    '</td></tr>' +
                '</table>' +
            '</td></tr></table>';
    }

    function renderDivider(block) {
        var d = block.data;
        var lineStyle = d.style || 'solid';
        var color = resolveDividerColor(block);
        var thickness = d.thickness || 1;
        var width = d.width || 100;
        var style = getPaddingStyle(block);

        return '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="' + style + '">' +
            '<tr><td align="center">' +
                '<table border="0" cellpadding="0" cellspacing="0" width="' + width + '%">' +
                    '<tr><td style="border-top:' + thickness + 'px ' + lineStyle + ' ' + color + ';font-size:1px;line-height:1px;">&nbsp;</td></tr>' +
                '</table>' +
            '</td></tr></table>';
    }

    function renderColumns(block) {
        var d = block.data;
        var columns = d.columns || 2;
        var widthPct = Math.floor(100 / columns);
        var style = getPaddingStyle(block);
        var columnsHtml = '';

        for (var i = 0; i < columns; i++) {
            var col = d.children[i];
            var innerContent = '';
            if (col && col.blocks && col.blocks.length > 0) {
                innerContent = col.blocks.map(function(b) { return renderBlock(b); }).join('\n');
            }
            columnsHtml += '<td valign="top" width="' + widthPct + '%" style="width:' + widthPct + '%;">' +
                '<table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                    innerContent +
                '</table></td>';
        }

        return '<!--[if mso]>' +
            '<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr>' +
            '<![endif]-->' +
            '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="' + style + '">' +
                '<tr><td>' +
                    '<table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                        '<tr>' + columnsHtml + '</tr>' +
                    '</table>' +
                '</td></tr>' +
            '</table>' +
            '<!--[if mso]>' +
            '</tr></table>' +
            '<![endif]-->';
    }

    function renderBlock(block) {
        switch (block.type) {
            case 'heading': return renderHeading(block);
            case 'paragraph': return renderParagraph(block);
            case 'image': return renderImage(block);
            case 'button': return renderButton(block);
            case 'divider': return renderDivider(block);
            case 'columns': return renderColumns(block);
            default: return '';
        }
    }

    function renderBody(blocks) {
        return blocks.map(function(b) { return renderBlock(b); }).join('\n');
    }

    function renderFullHtml(blocks, globalConfig, options) {
        options = options || {};
        globalConfig = globalConfig || {};
        var bodyContent = renderBody(blocks);
        var bgColor = globalConfig.backgroundColor || options.backgroundColor || '#f3f4f6';
        var contentBgColor = globalConfig.contentBgColor || options.contentBgColor || '#ffffff';
        var title = options.title || '邮件模板';
        var year = new Date().getFullYear();
        var cssVars = buildCssVariables(globalConfig);

        return '<!DOCTYPE html>\n' +
'<html lang="zh-CN" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">\n' +
'<head>\n' +
'    <meta charset="UTF-8">\n' +
'    <meta http-equiv="X-UA-Compatible" content="IE=edge">\n' +
'    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
'    <meta name="format-detection" content="telephone=no">\n' +
'    <meta name="format-detection" content="date=no">\n' +
'    <meta name="format-detection" content="address=no">\n' +
'    <meta name="format-detection" content="email=no">\n' +
'    <title>' + title + '</title>\n' +
'    <!--[if mso]>\n' +
'    <xml>\n' +
'        <o:OfficeDocumentSettings>\n' +
'            <o:AllowPNG/>\n' +
'            <o:PixelsPerInch>96</o:PixelsPerInch>\n' +
'        </o:OfficeDocumentSettings>\n' +
'    </xml>\n' +
'    <![endif]-->\n' +
'    <style type="text/css">\n' +
'        ' + cssVars +
'        body { margin: 0 !important; padding: 0 !important; -webkit-text-size-adjust: 100% !important; -ms-text-size-adjust: 100% !important; -webkit-font-smoothing: antialiased !important; }\n' +
'        img { border: 0 !important; outline: none !important; text-decoration: none !important; display: block; }\n' +
'        table { border-collapse: collapse !important; mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }\n' +
'        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }\n' +
'        .yshortcuts a { border-bottom: none !important; }\n' +
'        @media only screen and (max-width: 600px) {\n' +
'            .mj-column-per-100 { width: 100% !important; max-width: 100% !important; }\n' +
'            table[class="mj-column-per-100"] { width: 100% !important; }\n' +
'        }\n' +
'    </style>\n' +
'</head>\n' +
'<body bgcolor="' + bgColor + '" style="margin:0;padding:0;background-color:' + bgColor + ';">\n' +
'    <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="' + bgColor + '" style="background-color:' + bgColor + ';">\n' +
'        <tr>\n' +
'            <td align="center" style="padding:20px 0;">\n' +
'                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">\n' +
'                    <tr>\n' +
'                        <td align="center" style="padding:0 10px;">\n' +
'                            <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="' + contentBgColor + '" style="background-color:' + contentBgColor + ';border-radius:8px;overflow:hidden;">\n' +
                                bodyContent + '\n' +
'                            </table>\n' +
'                        </td>\n' +
'                    </tr>\n' +
'                </table>\n' +
'                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">\n' +
'                    <tr>\n' +
'                        <td align="center" style="padding:20px 10px;font-size:12px;color:#9ca3af;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;">\n' +
'                            &copy; ' + year + ' 邮件模板 &nbsp;|&nbsp; 由邮件模板编辑器生成\n' +
'                        </td>\n' +
'                    </tr>\n' +
'                </table>\n' +
'            </td>\n' +
'        </tr>\n' +
'    </table>\n' +
'</body>\n' +
'</html>';
    }

    function renderEditorBlock(block) {
        var d = block.data;
        switch (block.type) {
            case 'heading': {
                var tag = 'h' + (d.level || 1);
                var fontSize = isFieldExplicitlySet(block, 'fontSize') ? d.fontSize : 'var(--heading-font-size, 28)';
                var color = isFieldExplicitlySet(block, 'color') ? d.color : 'var(--text-color, #1f2937)';
                return '<' + tag + ' style="margin:0;font-size:' + getFontSizeUnit(fontSize) + ';color:' + color + ';font-weight:' + d.fontWeight + ';text-align:' + d.align + ';line-height:1.3;">' + escapeHtml(d.text) + '</' + tag + '>';
            }
            case 'paragraph': {
                var fontSize = isFieldExplicitlySet(block, 'fontSize') ? d.fontSize : 'var(--body-font-size, 14)';
                var color = isFieldExplicitlySet(block, 'color') ? d.color : 'var(--secondary-text-color, #4b5563)';
                return '<p style="margin:0;font-size:' + getFontSizeUnit(fontSize) + ';line-height:' + d.lineHeight + ';color:' + color + ';text-align:' + d.align + ';">' + escapeHtml(d.text).replace(/\n/g, '<br>') + '</p>';
            }
            case 'image': {
                var imgHtml = '<img src="' + escapeHtml(d.src) + '" alt="' + escapeHtml(d.alt || '') + '" style="display:block;max-width:100%;width:' + d.width + '%;height:auto;" />';
                if (d.href) {
                    imgHtml = '<a href="' + escapeHtml(d.href) + '" target="_blank" style="text-decoration:none;">' + imgHtml + '</a>';
                }
                return '<div style="text-align:' + d.align + ';">' + imgHtml + '</div>';
            }
            case 'button': {
                var bgColor = isFieldExplicitlySet(block, 'backgroundColor') ? d.backgroundColor : 'var(--primary-color, #667eea)';
                var textColor = isFieldExplicitlySet(block, 'color') ? d.color : '#ffffff';
                var fontSize = isFieldExplicitlySet(block, 'fontSize') ? d.fontSize : 'var(--body-font-size, 15)';
                return '<div style="text-align:' + d.align + ';"><span style="display:inline-block;padding:' + d.paddingVertical + 'px ' + d.paddingHorizontal + 'px;background:' + bgColor + ';color:' + textColor + ';text-decoration:none;font-size:' + getFontSizeUnit(fontSize) + ';font-weight:' + d.fontWeight + ';border-radius:' + d.borderRadius + 'px;">' + escapeHtml(d.text) + '</span></div>';
            }
            case 'divider': {
                var color = isFieldExplicitlySet(block, 'color') ? d.color : 'var(--divider-color, #e5e7eb)';
                return '<div style="text-align:center;"><div style="display:inline-block;width:' + d.width + '%;border-top:' + d.thickness + 'px ' + d.style + ' ' + color + ';"></div></div>';
            }
            case 'columns': {
                var cols = d.columns || 2;
                var colsHtml = '';
                for (var i = 0; i < cols; i++) {
                    var child = d.children[i];
                    var inner = '';
                    if (child) {
                        inner = renderEditorBlock(child);
                    } else {
                        inner = '<p style="color:#9ca3af;text-align:center;">空栏</p>';
                    }
                    colsHtml += '<div class="mj-column" data-col-index="' + i + '">' + inner + '</div>';
                }
                return '<div class="mj-column-wrapper">' + colsHtml + '</div>';
            }
            default:
                return '';
        }
    }

    return {
        renderFullHtml: renderFullHtml,
        renderBody: renderBody,
        renderBlock: renderBlock,
        renderEditorBlock: renderEditorBlock,
        buildCssVariables: buildCssVariables,
        isFieldExplicitlySet: isFieldExplicitlySet,
        getStyleValue: getStyleValue
    };
})();
