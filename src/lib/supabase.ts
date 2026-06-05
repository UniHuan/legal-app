import { createClient } from '@supabase/supabase-js';
import { DB_URL, DB_KEY } from './constants';
export const sb = createClient(DB_URL, DB_KEY);
