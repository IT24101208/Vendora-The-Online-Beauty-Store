import { initPage } from '../common.js';
import { setupProductForm } from './form-common.js';
initPage('create', async () => { await setupProductForm({ mode:'create' }); });
