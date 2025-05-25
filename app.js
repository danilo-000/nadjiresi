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

async function verifyToken() {
  showState('loadingState');

  try {
    // Parsiranje iz hash URL-a umesto query stringa
    const hashParams = new URLSearchParams(window.location.hash.substring(1));

    const token = hashParams.get('access_token');
    const type = hashParams.get('type'); // npr. 'signup'
    const email = hashParams.get('email'); // može biti null ako Supabase ne doda

    const errorCode = hashParams.get('error_code');

    if (errorCode === 'otp_expired') {
      throw new Error('Link za verifikaciju je istekao. Molimo zatražite novi link.');
    }

    if (!token || type !== 'signup') {
      throw new Error('Nevalidan link za verifikaciju');
    }

    // verifyOtp koristi token i email (ako postoji)
    const { error } = await supabase.auth.verifyOtp({
      type: 'signup',
      token: token,
      email: email || undefined // koristi ako postoji
    });

    if (error) throw error;

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