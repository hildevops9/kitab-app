/**
 * Seed data untuk 2 kitab:
 * 1. Al-Quran (surah Al-Fatihah + Al-Baqarah ayat 1-5 sebagai contoh)
 * 2. Al-Hikam karya Ibnu Atha'illah As-Sakandari (10 hikam pertama)
 *
 * Jalankan: node prisma/seed.js
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Memulai seeding...')

  // ─── 1. AL-QURAN ──────────────────────────────────────────────────────────
  const quran = await prisma.kitab.upsert({
    where: { slug: 'al-quran' },
    update: {},
    create: {
      slug: 'al-quran',
      type: 'QURAN',
      title: 'Al-Quran Al-Karim',
      arabicTitle: 'الْقُرْآنُ الْكَرِيمُ',
      author: 'Kalamullah',
      description: 'Kitab suci umat Islam. Terjemahan bahasa Indonesia oleh Kementerian Agama RI.',
      coverColor: '#1C3D2E',
      isPublished: true,
      babs: {
        create: [
          {
            slug: 'al-fatihah',
            title: 'Al-Fatihah',
            arabicTitle: 'الْفَاتِحَةُ',
            orderNum: 1,
            materis: {
              create: [
                {
                  title: 'Ayat 1-7 (Lengkap)',
                  orderNum: 1,
                  content: {
                    type: 'quran',
                    surahNumber: 1,
                    surahName: 'Al-Fatihah',
                    ayat: [
                      { number: 1, arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.' },
                      { number: 2, arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', translation: 'Segala puji bagi Allah, Tuhan seluruh alam.' },
                      { number: 3, arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', translation: 'Yang Maha Pengasih, Maha Penyayang.' },
                      { number: 4, arabic: 'مَالِكِ يَوْمِ الدِّينِ', translation: 'Pemilik hari pembalasan.' },
                      { number: 5, arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', translation: 'Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami mohon pertolongan.' },
                      { number: 6, arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', translation: 'Tunjukilah kami jalan yang lurus.' },
                      { number: 7, arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', translation: 'Yaitu jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.' },
                    ],
                  },
                },
              ],
            },
          },
          {
            slug: 'al-baqarah',
            title: 'Al-Baqarah',
            arabicTitle: 'الْبَقَرَةُ',
            orderNum: 2,
            materis: {
              create: [
                {
                  title: 'Ayat 1-5',
                  orderNum: 1,
                  content: {
                    type: 'quran',
                    surahNumber: 2,
                    surahName: 'Al-Baqarah',
                    ayat: [
                      { number: 1, arabic: 'الم', translation: 'Alif Lam Mim.' },
                      { number: 2, arabic: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ', translation: 'Kitab (Al-Qur\'an) ini tidak ada keraguan padanya; petunjuk bagi mereka yang bertakwa.' },
                      { number: 3, arabic: 'الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ', translation: 'Yaitu mereka yang beriman kepada yang gaib, melaksanakan salat, dan menginfakkan sebagian rezeki yang Kami berikan kepada mereka.' },
                      { number: 4, arabic: 'وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ', translation: 'Dan mereka yang beriman kepada (Al-Qur\'an) yang diturunkan kepadamu (Muhammad) dan (kitab-kitab) yang telah diturunkan sebelum engkau, dan mereka yakin akan adanya akhirat.' },
                      { number: 5, arabic: 'أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ', translation: 'Merekalah yang mendapat petunjuk dari Tuhannya, dan mereka itulah orang-orang yang beruntung.' },
                    ],
                  },
                },
                {
                  title: 'Ayat 255 (Ayat Kursi)',
                  orderNum: 2,
                  content: {
                    type: 'quran',
                    surahNumber: 2,
                    surahName: 'Al-Baqarah',
                    ayat: [
                      { number: 255, arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ', translation: 'Allah, tidak ada tuhan selain Dia. Yang Mahahidup, Yang terus menerus mengurus (makhluk-Nya), tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan apa yang ada di bumi. Tidak ada yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya. Dia mengetahui apa yang di hadapan mereka dan apa yang di belakang mereka, dan mereka tidak mengetahui sesuatu apa pun tentang ilmu-Nya melainkan apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi. Dan Dia tidak merasa berat memelihara keduanya, dan Dia Mahatinggi, Mahaagung.' },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  })

  // ─── 2. AL-HIKAM ──────────────────────────────────────────────────────────
  const hikam = await prisma.kitab.upsert({
    where: { slug: 'al-hikam' },
    update: {},
    create: {
      slug: 'al-hikam',
      type: 'HIKAM',
      title: 'Al-Hikam',
      arabicTitle: 'الْحِكَمُ الْعَطَائِيَّةُ',
      author: 'Ibnu Atha\'illah As-Sakandari',
      description: 'Kumpulan hikmah dan nasihat spiritual karya Syekh Ibnu Atha\'illah, dilengkapi terjemahan dan penjelasan.',
      coverColor: '#5C3A1E',
      isPublished: true,
      babs: {
        create: [
          {
            slug: 'muqaddimah',
            title: 'Muqaddimah',
            arabicTitle: 'مُقَدِّمَةٌ',
            orderNum: 1,
            materis: {
              create: [
                {
                  title: 'Hikam ke-1: Tanda Bergantung pada Amal',
                  orderNum: 1,
                  content: {
                    type: 'hikam',
                    number: 1,
                    arabic: 'مِنْ عَلَامَاتِ الاِعْتِمَادِ عَلَى الْعَمَلِ نُقْصَانُ الرَّجَاءِ عِنْدَ وُجُودِ الزَّلَلِ',
                    translation: 'Di antara tanda-tanda bergantung pada amal adalah berkurangnya harapan (kepada Allah) ketika melakukan kesalahan.',
                    explanation: 'Syekh mengajarkan bahwa seseorang yang bergantung pada amalnya akan merasa putus asa ketika berbuat dosa, karena ia menyangka pintu rahmat telah tertutup. Padahal, rahmat Allah jauh lebih luas dari segala dosa. Orang yang benar-benar mengenal Allah justru semakin bertambah harapannya kepada Allah setelah berbuat salah, karena ia tahu bahwa Allah adalah Maha Pengampun dan Maha Penyayang. Amal adalah anugerah dari Allah, bukan modal yang bisa dibanggakan.',
                  },
                },
                {
                  title: 'Hikam ke-2: Iradah-mu adalah Hijabmu',
                  orderNum: 2,
                  content: {
                    type: 'hikam',
                    number: 2,
                    arabic: 'إِرَادَتُكَ التَّجْرِيدَ مَعَ إِقَامَةِ اللَّهِ إِيَّاكَ فِي الأَسْبَابِ مِنَ الشَّهْوَةِ الْخَفِيَّةِ',
                    translation: 'Keinginanmu untuk melepaskan diri dari sebab-sebab duniawi padahal Allah telah menempatkanmu di dalamnya, adalah bagian dari nafsu yang tersembunyi.',
                    explanation: 'Banyak orang menyangka bahwa meninggalkan pekerjaan dan usaha duniawi lalu ber-uzlah adalah puncak kedekatan kepada Allah. Padahal jika Allah telah menempatkanmu dalam kehidupan berusaha, maka bersabar dan ikhlas di dalamnya itulah yang dikehendaki-Nya darimu. Keinginan untuk tampak zuhud bisa menjadi nafsu yang lebih halus dan berbahaya.',
                  },
                },
                {
                  title: 'Hikam ke-3: Amal yang Terbit dari Cahaya',
                  orderNum: 3,
                  content: {
                    type: 'hikam',
                    number: 3,
                    arabic: 'السَّوَابِقُ الْهِمَمِ لَا تَخْرِقُ أَسْوَارَ الأَقْدَارِ',
                    translation: 'Kemauan dan tekad yang kuat sekalipun tidak mampu menembus dinding-dinding takdir.',
                    explanation: 'Syekh mengingatkan bahwa seberapa pun kuat keinginan dan ikhtiar manusia, semuanya tetap berada dalam genggaman takdir Allah. Ini bukan berarti kita bermalas-malasan, namun agar kita tidak sombong atas keberhasilan dan tidak putus asa atas kegagalan. Segala sesuatu berjalan sesuai kehendak Allah yang Mahabijaksana.',
                  },
                },
              ],
            },
          },
          {
            slug: 'bab-tawakkal',
            title: 'Bab Tawakkal',
            arabicTitle: 'بَابُ التَّوَكُّلِ',
            orderNum: 2,
            materis: {
              create: [
                {
                  title: 'Hikam ke-4: Beristirahatlah dari Mengatur',
                  orderNum: 1,
                  content: {
                    type: 'hikam',
                    number: 4,
                    arabic: 'أَرِحْ نَفْسَكَ مِنَ التَّدْبِيرِ، فَمَا قَامَ بِهِ غَيْرُكَ عَنْكَ لَا تَقُمْ بِهِ لِنَفْسِكَ',
                    translation: 'Istirahatkanlah dirimu dari mengatur (urusanmu sendiri). Apa yang telah diurus oleh selainmu (Allah) untukmu, janganlah kamu lakukan itu untuk dirimu sendiri.',
                    explanation: 'Allah Subhanahu wa Ta\'ala telah mengurusi segala keperluan kita jauh sebelum kita lahir ke dunia. Rezeki, ajal, jodoh — semuanya telah diatur. Tugas kita adalah berikhtiar dan lalu berserah diri, bukan terus-menerus resah mengatur skenario kehidupan. Tawakkal yang sesungguhnya adalah ketenangan hati setelah berusaha maksimal.',
                  },
                },
                {
                  title: 'Hikam ke-5: Nur yang Menerangi Hati',
                  orderNum: 2,
                  content: {
                    type: 'hikam',
                    number: 5,
                    arabic: 'أَعْمَالُكَ قَوَالِبُ قَائِمَةٌ وَأَرْوَاحُهَا وُجُودُ سِرِّ الإِخْلَاصِ فِيهَا',
                    translation: 'Amal-amalmu adalah wadah (yang tampak di luar), sedangkan ruhnya adalah adanya rahasia ikhlas di dalamnya.',
                    explanation: 'Syekh menggambarkan bahwa shalat, puasa, dan ibadah lainnya ibarat jasad tanpa ruh jika tidak ada keikhlasan. Keikhlasan adalah nyawa dari setiap amal. Amal yang banyak namun tanpa keikhlasan tidak akan mengangkat derajat seseorang di sisi Allah, sedangkan amal yang sedikit namun ikhlas bisa menghantarkan ke puncak kedekatan dengan Allah.',
                  },
                },
              ],
            },
          },
        ],
      },
    },
  })

  console.log('✅ Seed selesai!')
  console.log(`   📖 Al-Quran: ${quran.id}`)
  console.log(`   📖 Al-Hikam: ${hikam.id}`)
}

main()
  .catch((e) => { console.error('❌ Seed gagal:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())