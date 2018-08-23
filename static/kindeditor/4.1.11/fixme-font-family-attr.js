// fixme font-family 解析错误
// KindEditor 在处理 font-family 属性时，会产生 font-family:&quot; 的值，
// 这将导致后面的样式在浏览器渲染时，后面的属性全部被丢弃
// 这里直接过滤掉 font-family，因为不同用户的字体文件可能不一样，直接采用系统默认
KindEditor.ready(function (K) {
  K.options.htmlTags = {
    font: ['id', 'class', 'color', 'size', 'face', '.background-color'],
    span: [
      'id', 'class', '.color', '.background-color', '.font-size', '.background',
      '.font-weight', '.font-style', '.text-decoration', '.vertical-align',
      '.line-height'
    ],
    div: [
      'id', 'class', 'align', '.border', '.margin', '.padding', '.text-align',
      '.color',
      '.background-color', '.font-size', '.font-weight', '.background',
      '.font-style', '.text-decoration', '.vertical-align', '.margin-left'
    ],
    table: [
      'id', 'class', 'border', 'cellspacing', 'cellpadding', 'width', 'height',
      'align', 'bordercolor',
      '.padding', '.margin', '.border', 'bgcolor', '.text-align', '.color',
      '.background-color',
      '.font-size', '.font-weight', '.font-style', '.text-decoration',
      '.background',
      '.width', '.height', '.border-collapse'
    ],
    'td,th': [
      'id', 'class', 'align', 'valign', 'width', 'height', 'colspan', 'rowspan',
      'bgcolor',
      '.text-align', '.color', '.background-color', '.font-size',
      '.font-weight',
      '.font-style', '.text-decoration', '.vertical-align', '.background',
      '.border'
    ],
    a: ['id', 'class', 'href', 'target', 'name'],
    embed: ['id', 'class', 'src', 'width', 'height', 'type', 'loop',
      'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess',
      'wmode'],
    img: ['id', 'class', 'src', 'width', 'height', 'border', 'alt', 'title',
      'align', '.width', '.height', '.border'],
    'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6': [
      'id', 'class', 'align', '.text-align', '.color', '.background-color',
      '.font-size', '.background',
      '.font-weight', '.font-style', '.text-decoration', '.vertical-align',
      '.text-indent', '.margin-left'
    ],
    pre: ['id', 'class'],
    hr: ['id', 'class', '.page-break-after'],
    'br,tbody,tr,strong,b,sub,sup,em,i,u,strike,s,del': ['id', 'class'],
    iframe: ['id', 'class', 'src', 'frameborder', 'width', 'height', '.width',
      '.height']
  };
});