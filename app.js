// Inicijalizacija Supabase klijenta
const supabaseUrl = 'https://dgjulcfmgmmfpjawamgc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnanVsY2ZtZ21tZnBqYXdhbWdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNzU5MDAsImV4cCI6MjA2MTg1MTkwMH0.bJWnb3i6VrOFii7Z9HkOOyBwBAYRnQnNmPInW3tm8bM';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Funkcija za prikaz različitih stanja
function showState(state) {
  document.getElementById('loadingState').classList.add('hidden');
  document.getElementById('successState').classList.add('hidden');
  document.getElementById('errorState').classList.add('hidden');
  
  document.getElementById(state).classList.remove('hidden');
}

// Provera tokena iz URL-a
async function verifyToken() {
  showState('loadingState');
  
  try {
    // Ekstrakcija parametara iz URL-a
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const type = urlParams.get('type');
    const errorCode = urlParams.get('error_code');
    
    // Provera da li je link istekao
    if (errorCode === 'otp_expired') {
      throw new Error('Link za verifikaciju je istekao. Molimo zatražite novi link.');
    }
    
    // Provera validnosti tokena i tipa
    if (!token || type !== 'signup') {
      throw new Error('Nevalidan link za verifikaciju');
    }
    
    // Verifikacija emaila
    const { error } = await supabase.auth.verifyOtp({
      type: 'signup',
      token: token
    });
    
    if (error) throw error;
    
    // Prikaz uspeha
    showState('successState');
    
  } catch (error) {
    console.error('Greška pri verifikaciji:', error);
    document.getElementById('errorMessage').textContent = 
      error.message || 'Došlo je do greške pri verifikaciji emaila';
    showState('errorState');
  }
}

// Dugme za ponovni pokušaj
document.getElementById('retryBtn').addEventListener('click', verifyToken);

// Pokretanje verifikacije kada se stranica učita
window.addEventListener('DOMContentLoaded', verifyToken);