# ckeditor4-plugin

## 1. Install plugin
Copy the contents from [`plugins/mave`](https://github.com/maveio/ckeditor4-plugin/tree/main/js/plugins/mave) to your project plugins folder.

## 2. Configure mave within your project:

```html
<script type="module">
  import { Player, Upload } from "https://cdn.mave.io/components@0.0.0/index.js";

  window.MAVE_CONFIG = {
    token: 'YOUR_TOKEN_HERE', // token (JWT): should include `sub`, `collection` and `iat` (in production)
  }
</script>
```

## 3. Add token to config
Replace the `YOUR_TOKEN_HERE` from the above code snippet by generating your own token. Go to https://jwt.io and fill in the appropiate info like shown below:
![jwt.io](https://user-images.githubusercontent.com/238946/231770389-b0453675-861e-4f37-b506-f717f5f4b35b.png)
