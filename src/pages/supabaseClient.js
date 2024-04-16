import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hdgpxktsxhhpdrvhlwsa.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkZ3B4a3RzeGhocGRydmhsd3NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE3MDcyNjEsImV4cCI6MjAyNzI4MzI2MX0._dlDy9qhO-Ibpl3wvInfVftDb2QaIgO2BpBgaqDzjK0";

export const supabase = createClient(supabaseUrl, supabaseKey);