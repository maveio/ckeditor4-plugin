CKEDITOR.plugins.add("mave", {
  icons: "mave",
  hidpi: true,
  init: function (editor) {
    editor.addCommand("mave", new CKEDITOR.dialogCommand("maveDialog"));

    editor.ui.addButton("Mave", {
      label: "Insert Video",
      command: "mave",
      toolbar: "insert",
    });
  },
});

const handleClick = (e) => {
  const embed = e.target.getAttribute('embed');
  if(embed.length != 15) return;
  const iframe = createPreview(embed);
  Object.values(CKEDITOR.instances)[0].insertElement(iframe);
  CKEDITOR.dialog.getCurrent().hide();
}

const handleCompleted = (e) => {
  const embed = e.detail.embed;
  const iframe = createPreview(embed);
  Object.values(CKEDITOR.instances)[0].insertElement(iframe);
  CKEDITOR.dialog.getCurrent().hide();
  
  e.target.reset();
}

const createPreview = (embed) => {
  const spaceId  = embed.slice(0, 5);
  const videoId = embed.slice(5, embed.length);

  if(MAVE_CONFIG.previewInlineTag == 'img') {
    return CKEDITOR.dom.element.createFromHtml(`<img data-type="mave_preview" data-embed="${embed}" src="https://space-${spaceId}.video-dns.com/${videoId}/placeholder.webp"></img>`);
  } else {
    return CKEDITOR.dom.element.createFromHtml(`<iframe data-type="mave_preview" data-embed="${embed}" src="https://space-${spaceId}.video-dns.com/${videoId}/player.html" sandbox="allow-scripts" style="width: 100%; aspect-ratio: 16/9;" frameborder="0" allow="fullscreen"></iframe>`);
  }  
}

CKEDITOR.dialog.add("maveDialog", function (editor) {
  return {
    title: "Video",
    minWidth: 480,
    minHeight: 270,

    contents: [
      {
        id: "upload",
        label: "Upload",
        title: "Upload",
        elements: [
          {
            type: "html",
            html: `
            <div style="display: relative; width: 100%; aspect-ratio: 16/9; margin-top: -1px; border-radius: 3px; overflow: hidden;">
              <mave-upload token="${MAVE_CONFIG.token}" locale="${MAVE_CONFIG.locale}" color="${MAVE_CONFIG.color}" font="${MAVE_CONFIG.font}" radius="${MAVE_CONFIG.radius}"></mave-upload>
            </div>
            `,
            onShow: function(e) {
              const upload = this.getElement().$.querySelector('mave-upload')
              upload.addEventListener('completed', handleCompleted)
            }
          },
        ],
      },
      {
        id: "gallery",
        label: "Gallery",
        title: "Gallery",
        elements: [
          {
            type: "html",
            html: `
            <div style="display: relative; width: 100%; aspect-ratio: 16/9; margin-top: -1px; border-radius: 3px; overflow-y: scroll;">
              <mave-list token="${MAVE_CONFIG.token}" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 9px; width: 100%;">
                <template>
                  <div style="position: relative; width: 154px; height: 86px; overflow: hidden;">
                    <mave-img onclick="handleClick(event)" style="width: 154px; height: 86px; border-radius: 3px; overflow: hidden; cursor: pointer;"></mave-img>
                    <div style="position: absolute; bottom: 4px; left: 4px; color: white; font-size: 11px; font-weight: 500; padding: 3px; background-color: rgba(0,0,0,0.3); height: 13px; width: 144px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; pointer-events: none;" slot="item-title"></div>
                  </div>
                </template>
              </mave-list>
            </div>
          `
          },
        ],
      },
    ]
  };
});
