const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ─── KITAB 1: Al-Quran ───────────────────────────────────
  const alquran = await prisma.kitab.upsert({
    where: { slug: 'al-quran-al-karim' },
    update: {},
    create: {
      slug: 'al-quran-al-karim',
      title: 'Al-Quran Al-Karim',
      arabicTitle: 'الْقُرْآنُ الْكَرِيم',
      author: 'Allah SWT',
      description: 'Kitab suci umat Islam yang diturunkan kepada Nabi Muhammad SAW. Dilengkapi terjemahan bahasa Indonesia.',
      coverColor: '#1C3D2E',
      type: 'QURAN',
      isPublished: true,
    }
  })

  const fatihah = await prisma.bab.upsert({
    where: { kitabId_slug: { kitabId: alquran.id, slug: 'al-fatihah' } },
    update: {},
    create: {
      kitabId: alquran.id,
      slug: 'al-fatihah',
      title: 'Al-Fatihah',
      arabicTitle: 'الْفَاتِحَة',
      orderNum: 1,
    }
  })

  const baqarah = await prisma.bab.upsert({
    where: { kitabId_slug: { kitabId: alquran.id, slug: 'al-baqarah' } },
    update: {},
    create: {
      kitabId: alquran.id,
      slug: 'al-baqarah',
      title: 'Al-Baqarah',
      arabicTitle: 'الْبَقَرَة',
      orderNum: 2,
    }
  })

  const aliImran = await prisma.bab.upsert({
    where: { kitabId_slug: { kitabId: alquran.id, slug: 'ali-imran' } },
    update: {},
    create: {
      kitabId: alquran.id,
      slug: 'ali-imran',
      title: 'Ali Imran',
      arabicTitle: 'آلِ عِمْرَان',
      orderNum: 3,
    }
  })

  // Ayat Al-Fatihah
  const fatihahAyat = [
    { id: 'q-fatihah-1', num: 1, title: 'Ayat 1', arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', latin: 'Bismillāhir-raḥmānir-raḥīm', terjemahan: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.' },
    { id: 'q-fatihah-2', num: 2, title: 'Ayat 2', arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', latin: 'Al-ḥamdu lillāhi rabbil-\'ālamīn', terjemahan: 'Segala puji bagi Allah, Tuhan seluruh alam.' },
    { id: 'q-fatihah-3', num: 3, title: 'Ayat 3', arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', latin: 'Ar-raḥmānir-raḥīm', terjemahan: 'Yang Maha Pengasih, Maha Penyayang.' },
    { id: 'q-fatihah-4', num: 4, title: 'Ayat 4', arabic: 'مَالِكِ يَوْمِ الدِّينِ', latin: 'Māliki yawmid-dīn', terjemahan: 'Pemilik hari pembalasan.' },
    { id: 'q-fatihah-5', num: 5, title: 'Ayat 5', arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', latin: 'Iyyāka na\'budu wa iyyāka nasta\'īn', terjemahan: 'Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami mohon pertolongan.' },
    { id: 'q-fatihah-6', num: 6, title: 'Ayat 6', arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', latin: 'Ihdinash-shirāṭal-mustaqīm', terjemahan: 'Tunjukkanlah kami jalan yang lurus.' },
    { id: 'q-fatihah-7', num: 7, title: 'Ayat 7', arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', latin: 'Shirāṭallażīna an\'amta \'alaihim ghairil-maghḍūbi \'alaihim wa laḍ-ḍāllīn', terjemahan: 'Yaitu jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan jalan mereka yang dimurkai, dan bukan pula jalan mereka yang sesat.' },
  ]

  for (const a of fatihahAyat) {
    await prisma.materi.upsert({
      where: { id: a.id },
      update: {},
      create: {
        id: a.id, babId: fatihah.id, title: a.title, orderNum: a.num,
        content: { type: 'quran', number: a.num, arabic: a.arabic, latin: a.latin, terjemahan: a.terjemahan }
      }
    })
  }

  // Ayat Al-Baqarah (sample)
  const baqarahAyat = [
    { id: 'q-baqarah-1', num: 1, title: 'Ayat 1', arabic: 'الم', latin: 'Alif lām mīm', terjemahan: 'Alif Lam Mim.' },
    { id: 'q-baqarah-2', num: 2, title: 'Ayat 2', arabic: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ', latin: 'Żālikal-kitābu lā raiba fīh, hudal lil-muttaqīn', terjemahan: 'Kitab (Al-Quran) ini tidak ada keraguan padanya; petunjuk bagi mereka yang bertakwa.' },
    { id: 'q-baqarah-3', num: 3, title: 'Ayat 3', arabic: 'الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ', latin: 'Allażīna yu\'minūna bil-gaibi wa yuqīmūnaṣ-ṣalāta wa mimmā razaqnāhum yunfiqūn', terjemahan: 'Yaitu mereka yang beriman kepada yang gaib, melaksanakan salat, dan menginfakkan sebagian rezeki yang Kami berikan kepada mereka.' },
    { id: 'q-baqarah-255', num: 255, title: 'Ayat 255 — Ayat Kursi', arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ', latin: 'Allāhu lā ilāha illā huw, al-ḥayyul-qayyūm, lā ta\'khużuhū sinatuw wa lā naum', terjemahan: 'Allah, tidak ada tuhan selain Dia. Yang Mahahidup, Yang terus menerus mengurus (makhluk-Nya), tidak mengantuk dan tidak tidur.' },
  ]

  for (const a of baqarahAyat) {
    await prisma.materi.upsert({
      where: { id: a.id },
      update: {},
      create: {
        id: a.id, babId: baqarah.id, title: a.title, orderNum: a.num,
        content: { type: 'quran', number: a.num, arabic: a.arabic, latin: a.latin, terjemahan: a.terjemahan }
      }
    })
  }

  // ─── KITAB 2: Al-Hikam ───────────────────────────────────
  const alhikam = await prisma.kitab.upsert({
    where: { slug: 'al-hikam' },
    update: {},
    create: {
      slug: 'al-hikam',
      title: 'Al-Hikam',
      arabicTitle: 'الْحِكَمُ الْعَطَائِيَّة',
      author: 'Ibnu Atha\'illah As-Sakandari',
      description: 'Kumpulan hikmah spiritual dari Syaikh Ibnu Atha\'illah. Salah satu karya tasawuf terpenting dalam Islam. Dilengkapi terjemahan dan penjelasan.',
      coverColor: '#5C3A1E',
      type: 'HIKAM',
      isPublished: true,
    }
  })

  const babTawakkal = await prisma.bab.upsert({
    where: { kitabId_slug: { kitabId: alhikam.id, slug: 'tawakkal-dan-amal' } },
    update: {},
    create: { kitabId: alhikam.id, slug: 'tawakkal-dan-amal', title: 'Tawakkal & Amal', arabicTitle: 'التَّوَكُّل', orderNum: 1 }
  })

  const babMakrifat = await prisma.bab.upsert({
    where: { kitabId_slug: { kitabId: alhikam.id, slug: 'makrifat-dan-ikhlas' } },
    update: {},
    create: { kitabId: alhikam.id, slug: 'makrifat-dan-ikhlas', title: 'Ma\'rifat & Ikhlas', arabicTitle: 'الْمَعْرِفَة', orderNum: 2 }
  })

  const babZuhud = await prisma.bab.upsert({
    where: { kitabId_slug: { kitabId: alhikam.id, slug: 'zuhud-dan-dunia' } },
    update: {},
    create: { kitabId: alhikam.id, slug: 'zuhud-dan-dunia', title: 'Zuhud & Dunia', arabicTitle: 'الزُّهْد', orderNum: 3 }
  })

  const hikamList = [
    {
      id: 'h-001', babId: babTawakkal.id, num: 1,
      title: 'Hikam 1 — Tanda Bergantung pada Amal',
      arabic: 'مِنْ عَلَامَاتِ الِاعْتِمَادِ عَلَى الْعَمَلِ نُقْصَانُ الرَّجَاءِ عِنْدَ وُجُودِ الزَّلَلِ',
      terjemahan: 'Di antara tanda-tanda bergantung pada amal adalah berkurangnya harapan kepada Allah ketika terjadi kesalahan.',
      penjelasan: 'Syaikh Ibnu Atha\'illah mengajarkan bahwa orang yang benar-benar bertawakal tidak akan putus asa ketika berbuat salah. Keputusasaan menunjukkan bahwa seseorang lebih bergantung pada amalnya daripada kepada rahmat Allah. Seorang mukmin sejati selalu memperbaharui harapannya kepada Allah.'
    },
    {
      id: 'h-002', babId: babTawakkal.id, num: 2,
      title: 'Hikam 2 — Keinginan Melepas Sebab',
      arabic: 'إِرَادَتُكَ التَّجْرِيدَ مَعَ إِقَامَةِ اللهِ إِيَّاكَ فِي الْأَسْبَابِ مِنَ الشَّهْوَةِ الْخَفِيَّةِ',
      terjemahan: 'Keinginanmu untuk melepaskan diri dari sebab-sebab duniawi, padahal Allah menempatkanmu di dalamnya, adalah syahwat tersembunyi.',
      penjelasan: 'Setiap orang memiliki kedudukan yang telah ditentukan Allah. Keinginan meninggalkan posisi itu tanpa izin Allah justru merupakan mengikuti hawa nafsu yang tersembunyi. Terimalah posisimu dan jalankan dengan ikhlas.'
    },
    {
      id: 'h-003', babId: babMakrifat.id, num: 3,
      title: 'Hikam 3 — Tembok Takdir',
      arabic: 'سَوَابِقُ الْهِمَمِ لَا تَخْرِقُ أَسْوَارَ الْأَقْدَارِ',
      terjemahan: 'Kehendak-kehendak yang kuat tidak dapat menembus tembok-tembok takdir.',
      penjelasan: 'Manusia boleh berusaha sekuat tenaga, namun pada akhirnya takdir Allah-lah yang menentukan. Bukan mengajak kepasifan, melainkan mengajarkan kerendahan hati. Berusahalah semaksimal mungkin, namun serahkan hasilnya kepada Allah SWT.'
    },
    {
      id: 'h-004', babId: babMakrifat.id, num: 4,
      title: 'Hikam 4 — Istirahat dari Pengaturan',
      arabic: 'أَرِحْ نَفْسَكَ مِنَ التَّدْبِيرِ، فَمَا قَامَ بِهِ غَيْرُكَ عَنْكَ لَا تَقُمْ بِهِ أَنْتَ عَنْ نَفْسِكَ',
      terjemahan: 'Istirahatkanlah dirimu dari mengatur segala sesuatu. Apa yang telah diurus oleh selain dirimu (Allah) untukmu, janganlah kamu urus sendiri.',
      penjelasan: 'Allah SWT telah menjamin rezeki dan urusan setiap makhluk-Nya. Ketika hamba terlalu sibuk mengatur hidupnya sendiri, ia sesungguhnya tidak mempercayai jaminan Allah. Bertawakallah dengan sepenuh hati.'
    },
    {
      id: 'h-005', babId: babZuhud.id, num: 5,
      title: 'Hikam 5 — Hakikat Pemberi',
      arabic: 'لَا تَمُدَّنَّ يَدَكَ إِلَى الْأَخْذِ مِنَ الْخَلْقِ إِلَّا أَنْ تَرَى أَنَّ الْمُعْطِيَ هُوَ الْحَقُّ',
      terjemahan: 'Janganlah kamu mengulurkan tanganmu untuk mengambil dari makhluk, kecuali jika kamu meyakini bahwa sesungguhnya yang memberi adalah Allah.',
      penjelasan: 'Ketika menerima pemberian dari sesama manusia, seorang arif tetap melihat bahwa hakikatnya Allah-lah yang memberi melalui perantara tersebut. Hatinya tidak terikat pada pemberi, tidak merasa terhutang budi kepada selain Allah.'
    },
  ]

  for (const h of hikamList) {
    await prisma.materi.upsert({
      where: { id: h.id },
      update: {},
      create: {
        id: h.id, babId: h.babId, title: h.title, orderNum: h.num,
        content: { type: 'hikam', number: h.num, arabic: h.arabic, terjemahan: h.terjemahan, penjelasan: h.penjelasan }
      }
    })
  }

  console.log('✅ Seeding selesai!')
  console.log('   📖 Al-Quran Al-Karim — 3 surah, 11 ayat')
  console.log('   📜 Al-Hikam — 3 bab, 5 hikam')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
