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

const localeMessages = {
  en: {
    emptyState: "No videos available."
  },
  nl: {
    emptyState: "Geen videos beschikbaar."
  }
};

let currentLocale = 'en'; // Default locale

const handleClick = (e) => {
  const embed = e.target.getAttribute('embed');
  if (embed.length != 15) return;
  const iframe = createPreview(embed);
  Object.values(CKEDITOR.instances)[0].insertElement(iframe);
  CKEDITOR.dialog.getCurrent().hide();
  checkIfListIsEmpty();
}

const handleCompleted = (e) => {
  const embed = e.detail.embed;
  const iframe = createPreview(embed);

  Object.values(CKEDITOR.instances)[0].insertElement(iframe);
  CKEDITOR.dialog.getCurrent().hide();
  e.target.reset();
  list.refresh().then(() => {
    checkIfListIsEmpty();
  });
}

const handleDelete = async (e) => {
  const button = e.target;
  const parentDiv = button.closest('div');
  const embed = parentDiv.querySelector('mave-img').getAttribute('embed');

  const url = `https://api.mave.io/v1/videos/${embed}/${MAVE_CONFIG.token}`;

  parentDiv.remove();
  checkIfListIsEmpty();

  try {
    const response = await fetch(url, { method: 'DELETE' });
    if (response.ok) {
      console.log('Video deleted successfully.');
    } else {
      console.error('Error deleting the video:', response.statusText);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

const createPreview = (embed) => {
  const spaceId = embed.slice(0, 5);
  const videoId = embed.slice(5, embed.length);

  if (MAVE_CONFIG.previewInlineTag == 'img') {
    return CKEDITOR.dom.element.createFromHtml(`<img data-type="mave_preview" data-embed="${embed}" src="https://space-${spaceId}.video-dns.com/${videoId}/placeholder.webp"></img>`);
  } else {
    return CKEDITOR.dom.element.createFromHtml(`<iframe data-type="mave_preview" data-embed="${embed}" src="https://space-${spaceId}.video-dns.com/${videoId}/player.html" sandbox="allow-scripts" style="width: 100%; aspect-ratio: 16/9;" frameborder="0" allow="fullscreen"></iframe>`);
  }
}

const checkIfListIsEmpty = () => {
  const maveList = document.getElementById('maveList');
  const emptyState = document.getElementById('emptyState');

  emptyState.textContent = localeMessages[currentLocale].emptyState;

  if (maveList && maveList.shadowRoot) {
    const maveImgs = maveList.shadowRoot.querySelectorAll('mave-img');

    if (maveImgs.length === 0) {
      emptyState.style.display = 'flex';
    } else {
      emptyState.style.display = 'none';
    }
  } else {
    emptyState.style.display = 'flex';
  }
}

// Use MutationObserver to detect when mave-list is fully loaded
const observeMaveListChanges = () => {
  const maveList = document.getElementById('maveList');
  if (maveList) {
    const observer = new MutationObserver(() => {
      checkIfListIsEmpty();
    });
    
    observer.observe(maveList, { childList: true, subtree: true });
  }
}

CKEDITOR.dialog.add("maveDialog", function (editor) {
  // Set the current locale from MAVE_CONFIG or other source
  currentLocale = MAVE_CONFIG.locale || 'en';

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
              <mave-upload 
                token="${MAVE_CONFIG.token}" 
                locale="${MAVE_CONFIG.locale}" 
                color="${MAVE_CONFIG.color}" 
                font="${MAVE_CONFIG.font}" 
                radius="${MAVE_CONFIG.radius}">
              </mave-upload>
              ${
                MAVE_CONFIG.uploadNotice && MAVE_CONFIG.uploadNotice[currentLocale] 
                  ? `<div class="upload-notice" style="margin-top: -15px; text-align: center; color: #777; font-size: 0.9em;">
                      ${MAVE_CONFIG.uploadNotice[currentLocale]}
                    </div>` 
                  : ''
              }
            </div>
            `,
            onShow: function (e) {
              const upload = this.getElement().$.querySelector('mave-upload');
              upload.addEventListener('completed', handleCompleted);
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
            <div style="display: relative; width: 100%; aspect-ratio: 16/9; margin-top: 3px; border-radius: 3px;">
              <div id="emptyState" class="empty-state" style="display: none;">
                  ${localeMessages[currentLocale].emptyState}
              </div>
              <mave-list id="maveList" token="${MAVE_CONFIG.token}" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 9px; width: 100%;">
                  <template>
                      <div style="position: relative; width: 154px; height: 96px; overflow: visible;">
                          <mave-img onclick="handleClick(event)" style="width: 154px; height: 86px; border-radius: 3px; cursor: pointer;" embed=""></mave-img>
                          <button class="delete-button" onclick="handleDelete(event)">&times;</button>
                          <div style="position: absolute; bottom: 4px; left: 4px; color: white; font-size: 11px; font-weight: 500; padding: 3px; background-color: rgba(0,0,0,0.3); height: 13px; width: 144px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; pointer-events: none;" slot="item-title"></div>
                      </div>
                  </template>
              </mave-list>
            </div>

            <style>
                .delete-button {
                    position: absolute;
                    top: -10px; /* Adjust to overlap more */
                    right: -10px; /* Adjust to overlap more */
                    width: 20px;
                    height: 20px;
                    background-color: rgba(255, 0, 0, 0.8);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    font-size: 16px; /* Adjust font size for better alignment */
                    line-height: 24px;
                    text-align: center;
                    cursor: pointer;
                    z-index: 10;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .delete-button:hover {
                    background-color: rgba(255, 0, 0, 1.0);
                }

                .empty-state {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #777;
                    font-size: 16px;
                    text-align: center;
                    height: 100%; /* Fill the parent container */
                }

                .upload-notice {
                    margin-top: 10px;
                    color: #777;
                }
            </style>
          `
          },
        ],
      },
    ],
    onShow: function () {
      observeMaveListChanges();
    },
    onLoad: function() {
      this.on('selectPage', function(e) {
        if (e.data.page === 'gallery') {
          const list = this.getElement().$.querySelector('mave-list');
          list.refresh().then(() => {
            checkIfListIsEmpty();
          });
        }
      });
    }
  };
});
