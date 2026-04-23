
import { productApi } from '../api.js';
import { CATEGORIES, CATEGORY_LABELS, renderOptions, serializeForm, toFormData, buildImageSrc, qs } from '../helpers.js';
import { toast } from '../ui.js';

function fillSelects() {
  document.getElementById('form-category').innerHTML =
    `<option value="">Select Category</option>${renderOptions(CATEGORIES.map(c => [c, CATEGORY_LABELS[c]]))}`;
  document.getElementById('form-status').innerHTML =
    renderOptions([['ACTIVE','Active'],['INACTIVE','Inactive'],['DISCONTINUED','Discontinued']], 'ACTIVE');
}

function setImagePreview(src = '') {
  const box = document.getElementById('image-preview');
  const removeBtn = document.getElementById('remove-image-btn');
  if (src) {
    box.innerHTML = `<img src="${src}" alt="Preview" />`;
    removeBtn.classList.remove('hidden');
  } else {
    box.innerHTML = '<span class="muted">No image</span>';
    removeBtn.classList.add('hidden');
  }
}

export async function setupProductForm({ mode = 'create' } = {}) {
  fillSelects();
  const form = document.getElementById('product-form');
  const fileInput = document.getElementById('image-input');
  const uploadTrigger = document.getElementById('upload-trigger');
  const removeBtn = document.getElementById('remove-image-btn');
  const submitBtn = document.getElementById('submit-btn');
  let imageFile = null;
  let removeImage = false;
  let currentProduct = null;

  uploadTrigger.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast('Image must be under 10MB', 'error');
      fileInput.value = '';
      return;
    }
    imageFile = file;
    removeImage = false;
    setImagePreview(URL.createObjectURL(file));
  });
  removeBtn.addEventListener('click', () => {
    imageFile = null;
    removeImage = true;
    fileInput.value = '';
    setImagePreview('');
  });

  if (mode === 'edit') {
    const id = qs('id');
    if (!id) {
      toast('Missing product id', 'error');
      return;
    }
    submitBtn.textContent = 'Update Product';
    currentProduct = await productApi.getById(id);
    Object.entries(currentProduct).forEach(([k,v]) => {
      const field = form.elements.namedItem(k);
      if (!field || v == null) return;
      if (field.type === 'date') field.value = String(v).slice(0,10);
      else field.value = v;
    });
    if (currentProduct?.category) document.getElementById('form-category').value = currentProduct.category;
    if (currentProduct?.status) document.getElementById('form-status').value = currentProduct.status;
    setImagePreview(buildImageSrc(currentProduct));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = mode === 'create' ? 'Saving...' : 'Updating...';
    try {
      const data = serializeForm(form);
      const fd = toFormData(data, imageFile, removeImage);
      const result = mode === 'create'
        ? await productApi.create(fd)
        : await productApi.update(currentProduct.id, fd);
      toast(mode === 'create' ? 'Product created successfully' : 'Product updated successfully');
      location.href = `product-detail.html?id=${result.id || currentProduct.id}`;
    } catch (e) {
      toast(e.message, 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = mode === 'create' ? 'Save Product' : 'Update Product';
    }
  });
}
