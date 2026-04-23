import { initPage } from '../common.js';
import { setupProductForm } from './form-common.js';
initPage('inventory', async () => { await setupProductForm({ mode:'edit' }); });
