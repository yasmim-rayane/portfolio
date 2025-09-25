// Module entrypoint: imports all side-effect modules and initializes UI
import './translation.js';
import './theme.js';
import { initUI } from './ui.js';

// Initialize consolidated UI (loader, offline banner, year, SW)
initUI();