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
  const iframe = createIframe(embed);
  Object.values(CKEDITOR.instances)[0].insertElement(iframe);
  CKEDITOR.dialog.getCurrent().hide();
}

const handleCompleted = (e) => {
  const embed = e.detail.embed;
  const iframe = createIframe(embed);
  Object.values(CKEDITOR.instances)[0].insertElement(iframe);
  CKEDITOR.dialog.getCurrent().hide();
}

const createIframe = (embed) => {
  const spaceId  = embed.slice(0, 5);
  const videoId = embed.slice(5, embed.length);

  return CKEDITOR.dom.element.createFromHtml(`<iframe src="https://space-${spaceId}.video-dns.com/${videoId}/player.html" style="width: 100%; aspect-ratio: 16/9;" frameborder="0" allow="fullscreen"></iframe>`);
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
              <mave-upload token="${MAVE_CONFIG.token}" style="display: relative;"></mave-upload>
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
            <div style="display: relative; width: 100%; aspect-ratio: 16/9; margin-top: -1px; border-radius: 3px; overflow: hidden;">
              <mave-list token="${MAVE_CONFIG.token}" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 9px; width: 100%;">
                <template>
                  <mave-img onclick="handleClick(event)" style="width: 154px; height: 86px; border-radius: 3px; overflow: hidden; cursor: pointer;"></mave-img>
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
