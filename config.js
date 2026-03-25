// Supabase Baglanti Bilgileri
var SUPABASE_URL = 'https://zhqknqwwspouwpykrcoh.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocWtucXd3c3BvdXdweWtyY29oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjI4NDUsImV4cCI6MjA4OTkzODg0NX0.lLI8c82tTaKH2o2CYYjiVrKgldSGmJ_WlmWQyKdkz3M';

// Supabase API yardimci fonksiyonlari
var DB = {

  // Hediye kaydet
  hediyeKaydet: async function(veri) {
    try {
      var id = Math.random().toString(36).substr(2, 8).toUpperCase();
      var kayit = {
        id: id,
        kategori_id: null,
        ambalaj: veri.ambalaj || 'kutu',
        ambalaj_emoji: veri.ambalajEmoji || '',
        mesaj: veri.mesaj || '',
        gonderen: veri.gonderen || '',
        ses: veri.ses || 'sessiz',
        renk: veri.renk || 'mor',
        fotograf_url: null,
        ana_kategori: veri.anaKategori || '',
        alt_kategori: veri.altKategori || '',
        odeme_durumu: 'odendi',
        acildi_mi: false
      };

      var response = await fetch(SUPABASE_URL + '/rest/v1/hediyeler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': 'Bearer ' + SUPABASE_KEY,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(kayit)
      });

      if (response.ok) {
        return { basarili: true, id: id };
      } else {
        var hata = await response.text();
        console.error('Kayit hatasi:', hata);
        return { basarili: false, hata: hata };
      }
    } catch(e) {
      console.error('Baglanti hatasi:', e);
      return { basarili: false, hata: e.message };
    }
  },

  // Hediye oku
  hediyeOku: async function(id) {
    try {
      var response = await fetch(
        SUPABASE_URL + '/rest/v1/hediyeler?id=eq.' + id + '&select=*',
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY
          }
        }
      );
      var data = await response.json();
      if (data && data.length > 0) {
        return { basarili: true, veri: data[0] };
      }
      return { basarili: false };
    } catch(e) {
      return { basarili: false, hata: e.message };
    }
  },

  // Fotoğraf yükle
  fotografYukle: async function(id, base64Data) {
    try {
      // base64'ten blob oluştur
      var arr = base64Data.split(',');
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      while(n--) { u8arr[n] = bstr.charCodeAt(n); }
      var blob = new Blob([u8arr], { type: mime });

      var dosyaAdi = id + '.jpg';
      var response = await fetch(
        SUPABASE_URL + '/storage/v1/object/hediye-fotograflar/' + dosyaAdi,
        {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Content-Type': mime
          },
          body: blob
        }
      );

      if (response.ok) {
        var url = SUPABASE_URL + '/storage/v1/object/public/hediye-fotograflar/' + dosyaAdi;
        return { basarili: true, url: url };
      }
      return { basarili: false };
    } catch(e) {
      return { basarili: false, hata: e.message };
    }
  }
};