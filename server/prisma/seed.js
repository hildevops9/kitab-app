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

  // ─── BAB-BAB AL-HIKAM ────────────────────────────────────
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

  const babNiat = await prisma.bab.upsert({
    where: { kitabId_slug: { kitabId: alhikam.id, slug: 'niat-dan-kehendak' } },
    update: {},
    create: { kitabId: alhikam.id, slug: 'niat-dan-kehendak', title: 'Niat & Kehendak', arabicTitle: 'النِّيَّة', orderNum: 4 }
  })

  const babHati = await prisma.bab.upsert({
    where: { kitabId_slug: { kitabId: alhikam.id, slug: 'hati-dan-cahaya' } },
    update: {},
    create: { kitabId: alhikam.id, slug: 'hati-dan-cahaya', title: 'Hati & Cahaya', arabicTitle: 'الْقَلْب', orderNum: 5 }
  })

  const babSyukur = await prisma.bab.upsert({
    where: { kitabId_slug: { kitabId: alhikam.id, slug: 'syukur-dan-sabar' } },
    update: {},
    create: { kitabId: alhikam.id, slug: 'syukur-dan-sabar', title: 'Syukur & Sabar', arabicTitle: 'الشُّكْر', orderNum: 6 }
  })

  const babTaubat = await prisma.bab.upsert({
    where: { kitabId_slug: { kitabId: alhikam.id, slug: 'taubat-dan-harapan' } },
    update: {},
    create: { kitabId: alhikam.id, slug: 'taubat-dan-harapan', title: 'Taubat & Harapan', arabicTitle: 'التَّوْبَة', orderNum: 7 }
  })

  const babRahmat = await prisma.bab.upsert({
    where: { kitabId_slug: { kitabId: alhikam.id, slug: 'rahmat-dan-ujian' } },
    update: {},
    create: { kitabId: alhikam.id, slug: 'rahmat-dan-ujian', title: 'Rahmat & Ujian', arabicTitle: 'الرَّحْمَة', orderNum: 8 }
  })

  // ─── 50 HIKAM ────────────────────────────────────────────
  const hikamList = [
    // ── BAB 1: TAWAKKAL & AMAL ──
    {
      id: 'h-001', babId: babTawakkal.id, num: 1,
      title: 'Hikam 1 — Tanda Bergantung pada Amal',
      arabic: 'مِنْ عَلَامَاتِ الِاعْتِمَادِ عَلَى الْعَمَلِ نُقْصَانُ الرَّجَاءِ عِنْدَ وُجُودِ الزَّلَلِ',
      terjemahan: 'Di antara tanda-tanda bergantung pada amal adalah berkurangnya harapan kepada Allah ketika terjadi kesalahan.',
      penjelasan: 'Syaikh Ibnu Atha\'illah mengajarkan bahwa orang yang benar-benar bertawakal tidak akan putus asa ketika berbuat salah. Keputusasaan menunjukkan bahwa seseorang lebih bergantung pada amalnya daripada kepada rahmat Allah. Seorang mukmin sejati selalu memperbaharui harapannya kepada Allah.',
      referensi: {
        label: 'Syarah Hikam 1 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1imEJfpf-psQRBvaAU7cIR3KYfiKqLA6k/view?usp=sharing'
      }
    },
    {
      id: 'h-002', babId: babTawakkal.id, num: 2,
      title: 'Hikam 2 — Keinginan Melepas Sebab',
      arabic: 'إِرَادَتُكَ التَّجْرِيدَ مَعَ إِقَامَةِ اللهِ إِيَّاكَ فِي الْأَسْبَابِ مِنَ الشَّهْوَةِ الْخَفِيَّةِ',
      terjemahan: 'Keinginanmu untuk melepaskan diri dari sebab-sebab duniawi, padahal Allah menempatkanmu di dalamnya, adalah syahwat tersembunyi.',
      penjelasan: 'Setiap orang memiliki kedudukan yang telah ditentukan Allah. Keinginan meninggalkan posisi itu tanpa izin Allah justru merupakan mengikuti hawa nafsu yang tersembunyi. Terimalah posisimu dan jalankan dengan ikhlas.',
      referensi: {
        label: 'Syarah Hikam 2 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1imEJfpf-psQRBvaAU7cIR3KYfiKqLA6k/view?usp=sharing'
      }
    },
    {
      id: 'h-003', babId: babTawakkal.id, num: 3,
      title: 'Hikam 3 — Tembok Takdir',
      arabic: 'سَوَابِقُ الْهِمَمِ لَا تَخْرِقُ أَسْوَارَ الْأَقْدَارِ',
      terjemahan: 'Kehendak-kehendak yang kuat tidak dapat menembus tembok-tembok takdir.',
      penjelasan: 'Manusia boleh berusaha sekuat tenaga, namun pada akhirnya takdir Allah-lah yang menentukan. Bukan mengajak kepasifan, melainkan mengajarkan kerendahan hati. Berusahalah semaksimal mungkin, namun serahkan hasilnya kepada Allah SWT.',
      referensi: {
        label: 'Syarah Hikam 3 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1imEJfpf-psQRBvaAU7cIR3KYfiKqLA6k/view?usp=sharing'
      }
    },
    {
      id: 'h-004', babId: babTawakkal.id, num: 4,
      title: 'Hikam 4 — Istirahat dari Pengaturan',
      arabic: 'أَرِحْ نَفْسَكَ مِنَ التَّدْبِيرِ، فَمَا قَامَ بِهِ غَيْرُكَ عَنْكَ لَا تَقُمْ بِهِ أَنْتَ عَنْ نَفْسِكَ',
      terjemahan: 'Istirahatkanlah dirimu dari mengatur segala sesuatu. Apa yang telah diurus oleh selain dirimu (Allah) untukmu, janganlah kamu urus sendiri.',
      penjelasan: 'Allah SWT telah menjamin rezeki dan urusan setiap makhluk-Nya. Ketika hamba terlalu sibuk mengatur hidupnya sendiri, ia sesungguhnya tidak mempercayai jaminan Allah. Bertawakallah dengan sepenuh hati.',
      referensi: {
        label: 'Syarah Hikam 4 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1YhMPlX_8-n_ffr4HtEWYKu41R6CuuNSF/view?usp=sharing'
      }
    },
    {
      id: 'h-005', babId: babTawakkal.id, num: 5,
      title: 'Hikam 5 — Hakikat Pemberi',
      arabic: 'لَا تَمُدَّنَّ يَدَكَ إِلَى الْأَخْذِ مِنَ الْخَلْقِ إِلَّا أَنْ تَرَى أَنَّ الْمُعْطِيَ هُوَ الْحَقُّ',
      terjemahan: 'Janganlah kamu mengulurkan tanganmu untuk mengambil dari makhluk, kecuali jika kamu meyakini bahwa sesungguhnya yang memberi adalah Allah.',
      penjelasan: 'Ketika menerima pemberian dari sesama manusia, seorang arif tetap melihat bahwa hakikatnya Allah-lah yang memberi melalui perantara tersebut. Hatinya tidak terikat pada pemberi, tidak merasa terhutang budi kepada selain Allah.',
      referensi: {
        label: 'Syarah Hikam 5 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1YhMPlX_8-n_ffr4HtEWYKu41R6CuuNSF/view?usp=sharing'
      }
    },
    {
      id: 'h-006', babId: babTawakkal.id, num: 6,
      title: 'Hikam 6 — Amal yang Diterima',
      arabic: 'مَنْ أَشَارَ إِلَى حَالِهِ لَمْ يَصِحَّ مِنَ الذُّلِّ اعْتِذَارُهُ',
      terjemahan: 'Barangsiapa yang membanggakan keadaan spiritualnya, permohonan maafnya tidaklah lahir dari kehinaan diri yang sejati.',
      penjelasan: 'Orang yang menunjuk-nunjuk pencapaian spiritual dan pengalaman rohaninya kepada orang lain, berarti ia belum melepaskan diri dari keakuan. Kerendahan hati yang sejati adalah tidak merasakan bahwa dirinya memiliki sesuatu yang bisa dibanggakan.',
      referensi: {
        label: 'Syarah Hikam 6 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1YhMPlX_8-n_ffr4HtEWYKu41R6CuuNSF/view?usp=sharing'
      }
    },
    {
      id: 'h-007', babId: babTawakkal.id, num: 7,
      title: 'Hikam 7 — Kerugian Orang yang Tidak Mengenal Allah',
      arabic: 'كَيْفَ يُشْرِقُ قَلْبٌ صُوَرُ الْأَكْوَانِ مُنْطَبِعَةٌ فِي مِرْآتِهِ',
      terjemahan: 'Bagaimana mungkin hati dapat bersinar sementara gambaran-gambaran dunia terukir dalam cermin nuraninya?',
      penjelasan: 'Hati laksana cermin. Ketika cermin dipenuhi oleh bayang-bayang dunia — keinginan, kekhawatiran, keterikatan — cahaya Allah tidak dapat memantul dengan sempurna. Membersihkan hati dari selain Allah adalah syarat utama menerima cahaya ilahi.',
      referensi: {
        label: 'Syarah Hikam 7 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1J3A5Kzzx_gOGn1_8jtMwff8PR7T0cvcX/view?usp=drive_link'
      }
    },
    {
      id: 'h-008', babId: babTawakkal.id, num: 8,
      title: 'Hikam 8 — Tanda Mengandalkan Amal',
      arabic: 'مَنْ عَرَفَ نَفْسَهُ أَشْغَلَهُ ذَلِكَ عَنْ ذَمِّ النَّاسِ وَمَنْ عَرَفَ رَبَّهُ أَشْغَلَهُ ذَلِكَ عَنِ الاِلْتِفَاتِ إِلَى نَفْسِهِ',
      terjemahan: 'Barangsiapa mengenal dirinya, kesibukan itu menghalanginya dari mencela orang lain. Barangsiapa mengenal Tuhannya, kesibukan itu menghalanginya dari memperhatikan dirinya sendiri.',
      penjelasan: 'Ada dua tingkatan kesadaran: mengenal diri dan mengenal Allah. Orang yang telah benar-benar mengenal kekurangan dirinya sendiri tidak akan sempat mencela orang lain. Lebih tinggi lagi, orang yang sibuk dengan keagungan Allah tidak sempat memikirkan dirinya sendiri.',
      referensi: {
        label: 'Syarah Hikam 8 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1J3A5Kzzx_gOGn1_8jtMwff8PR7T0cvcX/view?usp=drive_link'
      }
    },

    // ── BAB 2: MA'RIFAT & IKHLAS ──
    {
      id: 'h-009', babId: babMakrifat.id, num: 9,
      title: 'Hikam 9 — Ilmu yang Bermanfaat',
      arabic: 'الْعِلْمُ النَّافِعُ هُوَ الَّذِي يَنْبَسِطُ فِي الصَّدْرِ شُعَاعُهُ وَيُكْشَفُ بِهِ عَنِ الْقَلْبِ قِنَاعُهُ',
      terjemahan: 'Ilmu yang bermanfaat adalah ilmu yang sinarnya memancar dalam dada dan dengannya tersingkap tabir-tabir dari hati.',
      penjelasan: 'Bukan banyaknya hafalan yang menandai ilmu yang bermanfaat, melainkan cahaya yang dipancarkannya ke dalam hati. Ilmu yang sejati menyingkap tirai antara hamba dengan Tuhannya, melapangkan dada, dan menambah rasa takut serta cinta kepada Allah.',
      referensi: {
        label: 'Syarah Hikam 9 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1J3A5Kzzx_gOGn1_8jtMwff8PR7T0cvcX/view?usp=drive_link'
      }
    },
    {
      id: 'h-010', babId: babMakrifat.id, num: 10,
      title: 'Hikam 10 — Ikhlas dalam Amal',
      arabic: 'الأَعْمَالُ صُوَرٌ قَائِمَةٌ وَأَرْوَاحُهَا وُجُودُ سِرِّ الإِخْلَاصِ فِيهَا',
      terjemahan: 'Amal-amal adalah jasad yang berdiri, sedangkan ruhnya adalah keberadaan rahasia ikhlas di dalamnya.',
      penjelasan: 'Sebuah amal tanpa ikhlas ibarat jasad tanpa nyawa — tampak berdiri namun sesungguhnya mati. Ikhlas adalah rahasia tersembunyi yang hanya Allah yang tahu. Ia adalah ruh yang menghidupkan setiap amal perbuatan sehingga diterima di sisi-Nya.',
      referensi: {
        label: 'Syarah Hikam 10 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1Tho_MJWU0wSPa0Ke4kAi5AYR7pfgYEn5/view?usp=drive_link'
      }
    },
    {
      id: 'h-011', babId: babMakrifat.id, num: 11,
      title: 'Hikam 11 — Rahasia Taufik',
      arabic: 'ادْفِنْ وُجُودَكَ فِي أَرْضِ الخُمُولِ فَمَا نَبَتَ مِمَّا لَمْ يُدْفَنْ لَا يَتِمُّ نِتَاجُهُ',
      terjemahan: 'Kuburkanlah keberadaanmu di tanah ketersembunyian, karena sesuatu yang tumbuh tanpa ditanam tidak akan sempurna buahnya.',
      penjelasan: 'Seperti benih yang harus dikuburkan dalam tanah sebelum ia tumbuh dan berbuah, seorang murid harus menguburkan keakuannya dalam kerendahan hati. Ketenaran dan kemasyhuran sebelum matang justru merusak pertumbuhan spiritual.',
      referensi: {
        label: 'Syarah Hikam 11 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1Tho_MJWU0wSPa0Ke4kAi5AYR7pfgYEn5/view?usp=drive_link'
      }
    },
    {
      id: 'h-012', babId: babMakrifat.id, num: 12,
      title: 'Hikam 12 — Hakikat Tawadhu',
      arabic: 'لَا تَرْفَعَنَّكَ فِي عَيْنِكَ نِعْمَةُ الطَّاعَةِ وَلَا تَحُطَّنَّكَ عَنْ قَدْرِكَ وَرْطَةُ الْمَعْصِيَةِ',
      terjemahan: 'Janganlah nikmat ketaatan membuatmu tinggi dalam pandanganmu sendiri, dan janganlah lumpur kemaksiatan menjatuhkan harga dirimu.',
      penjelasan: 'Seorang hamba tidak seharusnya merasa tinggi karena berhasil taat, sebab ketaatan itu sendiri adalah karunia dari Allah. Sebaliknya, kemaksiatan pun tidak boleh membuatnya berputus asa dari rahmat Allah. Sikap pertengahan inilah yang menandai keseimbangan jiwa seorang mukmin.',
      referensi: {
        label: 'Syarah Hikam 12 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1Tho_MJWU0wSPa0Ke4kAi5AYR7pfgYEn5/view?usp=drive_link'
      }
    },
    {
      id: 'h-013', babId: babMakrifat.id, num: 13,
      title: 'Hikam 13 — Kemiskinan Hakiki',
      arabic: 'لَيْسَ الْفَقِيرُ مَنْ لَيْسَ لَهُ شَيْءٌ، وَلَكِنِ الْفَقِيرُ مَنْ لَيْسَ لَهُ رَبٌّ',
      terjemahan: 'Orang yang fakir bukan orang yang tidak memiliki apa-apa, melainkan orang yang tidak memiliki Tuhan.',
      penjelasan: 'Kemiskinan sejati bukanlah soal harta benda. Orang yang memiliki segalanya namun tidak memiliki hubungan dengan Allah adalah orang yang paling miskin. Sebaliknya, orang yang tidak punya apa-apa namun hatinya dipenuhi kehadiran Allah adalah orang yang paling kaya.',
      referensi: {
        label: 'Syarah Hikam 13 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/19U48OUMx1yx7WEUenujm0bU7eH1gRI_n/view?usp=drive_link'
      }
    },
    {
      id: 'h-014', babId: babMakrifat.id, num: 14,
      title: 'Hikam 14 — Kekayaan Hati',
      arabic: 'مَنْ لَمْ تَكُنْ لَهُ مِنَ اللهِ عِنَايَةٌ خَذَلَتْهُ الْوَسَائِلُ، وَمَنْ تَوَجَّهَتْ إِلَيْهِ الْعِنَايَةُ وَصَلَتْ إِلَيْهِ الدَّلَائِلُ',
      terjemahan: 'Barangsiapa tidak mendapat pertolongan dari Allah, segala wasilah (perantara) akan mengecewainya. Barangsiapa dituju oleh pertolongan-Nya, segala petunjuk akan sampai kepadanya.',
      penjelasan: 'Pertolongan dan taufik semata-mata datang dari Allah. Ketika Allah menghendaki kebaikan bagi seseorang, Dia membukakan segala jalan dan petunjuk. Sebaliknya, tanpa pertolongan-Nya, usaha apapun yang dilakukan melalui perantara tidak akan membuahkan hasil yang diharapkan.',
      referensi: {
        label: 'Syarah Hikam 14 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/19U48OUMx1yx7WEUenujm0bU7eH1gRI_n/view?usp=drive_link'
      }
    },
    {
      id: 'h-015', babId: babMakrifat.id, num: 15,
      title: 'Hikam 15 — Perbedaan Orang Arif dan Abid',
      arabic: 'الْعَارِفُ مَنْ شَهِدَ الْحَقَّ فِي كُلِّ شَيْءٍ بَلْ مَنْ شَهِدَهُ فِي كُلِّ شَيْءٍ',
      terjemahan: 'Orang arif adalah orang yang menyaksikan Allah dalam segala sesuatu, bahkan yang menyaksikan-Nya melalui segala sesuatu.',
      penjelasan: 'Tingkatan tertinggi makrifat adalah ketika seorang hamba tidak lagi melihat sesuatu tanpa melihat Allah di baliknya. Setiap makhluk menjadi cermin yang memantulkan keagungan, keindahan, dan kekuasaan Sang Pencipta. Inilah puncak dari musyahadah (penyaksian) spiritual.',
      referensi: {
        label: 'Syarah Hikam 15 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/19U48OUMx1yx7WEUenujm0bU7eH1gRI_n/view?usp=drive_link'
      }
    },
    {
      id: 'h-016', babId: babMakrifat.id, num: 16,
      title: 'Hikam 16 — Cahaya Hati',
      arabic: 'نُورٌ أَوْدَعَهُ فِي قُلُوبِكُمْ ثُمَّ أَمَدَّكُمْ بِنُورِ الْوَحْيِ وَالتَّنْزِيلِ',
      terjemahan: 'Allah menitipkan cahaya dalam hatimu, kemudian Dia menambahkannya dengan cahaya wahyu dan Al-Quran.',
      penjelasan: 'Manusia dilahirkan dengan fitrah — cahaya primordial yang Allah titipkan dalam hati. Wahyu dan Al-Quran hadir bukan untuk menciptakan cahaya baru, melainkan untuk memperkuat dan mengarahkan cahaya fitrah yang telah ada. Keduanya saling melengkapi untuk menerangi jalan menuju Allah.'
    },

    // ── BAB 3: ZUHUD & DUNIA ──
    {
      id: 'h-017', babId: babZuhud.id, num: 17,
      title: 'Hikam 17 — Hakikat Dunia',
      arabic: 'الدُّنْيَا كُلُّهَا جَهْلٌ وَظُلْمَةٌ إِلَّا مَوَاضِعَ الْعِلْمِ وَكُلُّ الْعِلْمِ حُجَّةٌ إِلَّا مَا عَمِلَ بِهِ',
      terjemahan: 'Dunia seluruhnya adalah kebodohan dan kegelapan kecuali di tempat-tempat ilmu, dan seluruh ilmu adalah hujjah (yang memberatkan) kecuali ilmu yang diamalkan.',
      penjelasan: 'Dunia tanpa ilmu adalah kegelapan. Namun ilmu pun tidak cukup jika tidak diamalkan — ia justru menjadi hujjah yang memberatkan pemiliknya di hari kiamat. Maka ilmu yang sejati adalah ilmu yang mendorong pemiliknya untuk beramal dan mendekatkan diri kepada Allah.'
    },
    {
      id: 'h-018', babId: babZuhud.id, num: 18,
      title: 'Hikam 18 — Zuhud Sejati',
      arabic: 'الزَّاهِدُ مَنْ أَعْرَضَ عَنِ الدُّنْيَا بِقَلْبِهِ وَإِنْ كَانَتْ تَمُرُّ بِيَدِهِ',
      terjemahan: 'Orang yang zuhud adalah orang yang berpaling dari dunia dengan hatinya, meskipun dunia itu melewati tangannya.',
      penjelasan: 'Zuhud sejati bukan berarti tidak memiliki harta atau tidak bekerja. Zuhud adalah kondisi hati yang tidak terikat oleh dunia. Harta boleh ada di tangan, namun tidak boleh merasuk ke dalam hati. Seperti perahu yang ada di atas air namun air tidak boleh masuk ke dalamnya.'
    },
    {
      id: 'h-019', babId: babZuhud.id, num: 19,
      title: 'Hikam 19 — Bahaya Cinta Dunia',
      arabic: 'حُبُّكَ لِلدُّنْيَا أَصْلُ كُلِّ خَطِيئَةٍ وَالدُّنْيَا دَارُ مَنْ لَا دَارَ لَهُ',
      terjemahan: 'Cintamu kepada dunia adalah akar dari setiap dosa. Dunia adalah rumah bagi orang yang tidak punya rumah (akhirat).',
      penjelasan: 'Semua dosa pada akhirnya bisa ditelusuri kepada kecintaan yang berlebihan pada dunia — cinta pada harta, kedudukan, dan kenikmatan sementara. Dunia ini hanyalah persinggahan sementara. Orang yang cerdas mempersiapkan rumah abadi di akhirat, bukan membangun istana di persinggahan.'
    },
    {
      id: 'h-020', babId: babZuhud.id, num: 20,
      title: 'Hikam 20 — Kebebasan dari Dunia',
      arabic: 'أَخْرِجْ مِنْ قَلْبِكَ الدُّنْيَا وَأَدْخِلْ فِيهِ ذِكْرَ اللهِ يَمْلَأْهُ',
      terjemahan: 'Keluarkan dunia dari hatimu dan masukkan dzikir kepada Allah, niscaya Allah akan memenuhinya.',
      penjelasan: 'Hati manusia laksana sebuah wadah yang tidak dapat berisi dua hal bertentangan secara bersamaan. Ketika dunia dikeluarkan dari hati, ruang kosong itu akan diisi oleh dzikrullah. Dan ketika hati dipenuhi dzikir kepada Allah, itulah kebahagiaan yang sesungguhnya.'
    },
    {
      id: 'h-021', babId: babZuhud.id, num: 21,
      title: 'Hikam 21 — Tipuan Amal Banyak',
      arabic: 'لَا تَسْتَوْحِشْ مِنْ وَحْشَةِ الطُّرُقِ إِذَا أَنَارَ لَكَ الْحَقُّ مَصَابِيحَهَا',
      terjemahan: 'Janganlah kamu merasa takut dengan kesunyian jalan-jalan itu, apabila Allah telah menerangi untukmu lentera-lenteranya.',
      penjelasan: 'Jalan menuju Allah terkadang terasa sepi dan asing, berbeda dari jalan yang dilalui kebanyakan orang. Namun jika Allah telah menerangi jalan itu dengan nur-Nya, kesunyian tersebut justru menjadi ketenangan. Seorang salik tidak takut berjalan sendiri selama ia berjalan bersama Allah.'
    },

    // ── BAB 4: NIAT & KEHENDAK ──
    {
      id: 'h-022', babId: babNiat.id, num: 22,
      title: 'Hikam 22 — Kehendak Allah dan Kehendak Hamba',
      arabic: 'لَا تَطْلُبْ مِنْهُ أَنْ يُخْرِجَكَ مِنْ حَالَةٍ لِيَسْتَعْمِلَكَ فِيمَا سِوَاهَا فَلَوْ أَرَادَكَ لَاسْتَعْمَلَكَ مِنْ غَيْرِ إِخْرَاجٍ',
      terjemahan: 'Janganlah meminta Allah mengeluarkanmu dari satu keadaan untuk menggunakanmu pada keadaan lain. Karena jika Allah menghendakimu, Dia akan menggunakanmu tanpa perlu mengeluarkanmu.',
      penjelasan: 'Terkadang kita berdoa meminta perubahan kondisi karena kita merasa kondisi yang ada menghalangi amal kita. Padahal Allah Maha Kuasa menggunakan kita dalam kondisi apapun. Tugas kita adalah menerima kondisi yang ada dan memberikan yang terbaik di dalamnya.'
    },
    {
      id: 'h-023', babId: babNiat.id, num: 23,
      title: 'Hikam 23 — Kecukupan dalam Ilmu Allah',
      arabic: 'كَفَاكَ مِنَ الطَّلَبِ عِلْمُهُ بِكَ كَفَاكَ مِنَ الدُّعَاءِ عِلْمُهُ بِحَالِكَ',
      terjemahan: 'Cukuplah bagimu sebagai permohonan bahwa Allah mengetahuimu. Cukuplah bagimu sebagai doa bahwa Allah mengetahui keadaanmu.',
      penjelasan: 'Allah mengetahui keadaan hamba-Nya jauh sebelum hamba itu memohon. Ini bukan ajaran untuk tidak berdoa, melainkan untuk membersihkan niat dalam berdoa. Doa bukan untuk menginformasikan Allah, melainkan sebagai ungkapan penghambaan dan kebutuhan kita kepada-Nya.'
    },
    {
      id: 'h-024', babId: babNiat.id, num: 24,
      title: 'Hikam 24 — Keberkahan Niat',
      arabic: 'رُبَّ عُمُرٍ اتَّسَعَتْ آمَادُهُ وَقَلَّتْ أَمْدَادُهُ وَرُبَّ عُمُرٍ قَلِيلَةٌ آمَادُهُ كَثِيرَةٌ أَمْدَادُهُ',
      terjemahan: 'Betapa banyak umur yang panjang waktunya namun sedikit keberkahannya, dan betapa banyak umur yang pendek waktunya namun berlimpah keberkahannya.',
      penjelasan: 'Panjang pendeknya umur bukan tolok ukur nilai seseorang. Umur yang berkah adalah umur yang diisi dengan amal saleh, ilmu yang bermanfaat, dan kedekatan kepada Allah. Seseorang bisa hidup lama namun tidak menghasilkan apa-apa, sementara yang lain hidup singkat namun meninggalkan warisan keimanan yang abadi.'
    },
    {
      id: 'h-025', babId: babNiat.id, num: 25,
      title: 'Hikam 25 — Bahaya Mengagumi Diri',
      arabic: 'خَوْفُكَ مِنَ الذَّنْبِ حِينَ وُجُودِهِ أَكْثَرُ نَفْعًا مِنْ خَوْفِكَ مِنَ الذَّنْبِ حِينَ عَدَمِهِ',
      terjemahan: 'Rasa takutmu terhadap dosa ketika dosa itu ada lebih bermanfaat daripada rasa takutmu terhadap dosa ketika dosa itu belum ada.',
      penjelasan: 'Rasa takut yang mendorong taubat nyata lebih bernilai daripada rasa takut yang bersifat abstrak. Ketika seseorang benar-benar jatuh dalam dosa, rasa takut yang muncul akan mendorongnya kepada taubat yang sungguh-sungguh, yang justru dapat mengangkat derajatnya lebih tinggi dari sebelumnya.'
    },
    {
      id: 'h-026', babId: babNiat.id, num: 26,
      title: 'Hikam 26 — Tawadu dalam Niat',
      arabic: 'مَا اسْتُودِعَ فِي غَيْبِ الطَّوِيَّاتِ ظَهَرَ فِي شَهَادَةِ السَّمَوَاتِ',
      terjemahan: 'Apa yang tersimpan dalam rahasia niat akan tampak nyata dalam kesaksian alam semesta.',
      penjelasan: 'Niat tersembunyi di dalam hati, namun Allah akan menampakkan buahnya di dunia nyata. Seseorang yang menyimpan niat ikhlas di hatinya akan tampak keindahannya dalam perilaku dan kehidupannya. Demikian pula niat yang kotor — cepat atau lambat ia akan terwujud dalam tindakan.'
    },

    // ── BAB 5: HATI & CAHAYA ──
    {
      id: 'h-027', babId: babHati.id, num: 27,
      title: 'Hikam 27 — Hati yang Hidup',
      arabic: 'الْقَلْبُ الْمَيِّتُ لَا يَتَأَلَّمُ بِجُرُوحِ الذُّنُوبِ',
      terjemahan: 'Hati yang mati tidak merasakan sakit dari luka-luka dosa.',
      penjelasan: 'Salah satu tanda hati yang masih hidup adalah rasa sakit dan penyesalan ketika berbuat dosa. Hati yang telah mati — tertutup oleh kemaksiatan yang terus-menerus — tidak lagi merasakan kepedihan itu. Maka rasa sesal setelah berbuat dosa adalah tanda keimanan, bukan kelemahan.'
    },
    {
      id: 'h-028', babId: babHati.id, num: 28,
      title: 'Hikam 28 — Cahaya Bashirah',
      arabic: 'نُورُ الْبَصِيرَةِ مَا يَكْشِفُ عَنْ حَقِيقَةِ الدُّنْيَا وَمَا فِيهَا',
      terjemahan: 'Cahaya bashirah (penglihatan batin) adalah cahaya yang menyingkap hakikat dunia dan isinya.',
      penjelasan: 'Bashirah adalah mata hati yang melihat apa yang tidak dapat dilihat oleh mata lahir. Dengan bashirah, seseorang melihat dunia sebagaimana adanya — sementara, fana, dan penuh tipuan. Cahaya ini adalah anugerah Allah kepada hamba yang bersungguh-sungguh membersihkan hatinya.'
    },
    {
      id: 'h-029', babId: babHati.id, num: 29,
      title: 'Hikam 29 — Kelembutan Allah',
      arabic: 'مَنْ أَشْرَقَتْ بِدَايَتُهُ أَشْرَقَتْ نِهَايَتُهُ',
      terjemahan: 'Barangsiapa yang awalnya bersinar (dengan hidayah), maka akhirnya pun akan bersinar.',
      penjelasan: 'Permulaan yang baik — diawali dengan niat ikhlas, langkah yang benar, dan petunjuk Allah — adalah pertanda baik untuk akhir yang baik pula. Maka sangat penting untuk memperhatikan fondasi dan permulaan setiap amal. Pemula yang ikhlas lebih berpeluang sampai ke tujuan daripada yang berlari dengan niat yang salah.'
    },
    {
      id: 'h-030', babId: babHati.id, num: 30,
      title: 'Hikam 30 — Musibah yang Membuka Hati',
      arabic: 'رُبَّمَا أَعْطَاكَ فَمَنَعَكَ وَرُبَّمَا مَنَعَكَ فَأَعْطَاكَ',
      terjemahan: 'Terkadang Allah memberimu (sesuatu yang tampak seperti pemberian) namun sebenarnya Dia menghalangimu. Dan terkadang Dia menghalangimu (dari sesuatu) namun sebenarnya Dia memberimu.',
      penjelasan: 'Pemberian yang membuat seseorang lalai dari Allah sejatinya adalah penghalang dari kebaikan. Sebaliknya, terhalang dari sesuatu yang dicintai namun hal itu membuka jalan menuju Allah adalah pemberian yang sesungguhnya. Pandangan kita terhadap takdir seringkali terbalik dari hakikatnya.'
    },
    {
      id: 'h-031', babId: babHati.id, num: 31,
      title: 'Hikam 31 — Bersama Allah',
      arabic: 'لَا تَطْلُبْ مَنْزِلَةً وَلَكِنِ اطْلُبِ الرَّفِيقَ وَالدَّلِيلَ فَإِذَا وَجَدْتَ الرَّفِيقَ كَانَتِ الْمَنَازِلُ تَبَعًا',
      terjemahan: 'Janganlah mencari kedudukan (spiritual), tetapi carilah teman perjalanan dan petunjuk jalan. Jika kamu telah menemukan teman perjalanan itu, maka kedudukan akan mengikutinya sendiri.',
      penjelasan: 'Kesalahan banyak penempuh jalan spiritual adalah terlalu fokus pada pencapaian kedudukan dan maqam. Yang sesungguhnya dicari adalah kebersamaan dengan Allah dan para pembimbing yang sahih. Ketika keduanya ditemukan, maqam-maqam spiritual akan hadir dengan sendirinya.'
    },
    {
      id: 'h-032', babId: babHati.id, num: 32,
      title: 'Hikam 32 — Doa Orang yang Lalai',
      arabic: 'الدُّعَاءُ مِفْتَاحُ الْخَيْرِ وَالدُّعَاءُ سِلَاحُ الْمُؤْمِنِ',
      terjemahan: 'Doa adalah kunci segala kebaikan dan senjata orang beriman.',
      penjelasan: 'Doa bukan sekadar ritual, melainkan senjata yang nyata di tangan orang yang beriman. Doa membuka pintu-pintu yang terkunci, mengubah takdir yang telah tersusun, dan mendekatkan hamba kepada Tuhannya. Orang yang meninggalkan doa sesungguhnya telah melepaskan senjatanya di medan peperangan.'
    },

    // ── BAB 6: SYUKUR & SABAR ──
    {
      id: 'h-033', babId: babSyukur.id, num: 33,
      title: 'Hikam 33 — Nikmat Terbesar',
      arabic: 'مِنْ أَعْظَمِ النِّعَمِ عَلَيْكَ أَنْ أَقَامَكَ فِي الظَّاهِرِ عَلَى الْخِدْمَةِ وَأَدَّبَكَ فِي الْبَاطِنِ عَلَى الرُّبُوبِيَّةِ',
      terjemahan: 'Di antara nikmat terbesar atasmu adalah bahwa Allah menugaskanmu secara lahir dalam ibadah dan mendidikmu secara batin dengan penghayatan rububiyah-Nya.',
      penjelasan: 'Nikmat terbesar bukan harta atau kesehatan, melainkan ditempatkannya seseorang dalam barisan ahli ibadah, dan lebih dari itu, dianugerahkannya penghayatan batin bahwa seluruh ibadah hanya untuk Allah. Orang yang mencapai ini telah meraih dua nikmat sekaligus: ibadah lahir yang istiqamah dan hati yang hadir.'
    },
    {
      id: 'h-034', babId: babSyukur.id, num: 34,
      title: 'Hikam 34 — Kesabaran yang Indah',
      arabic: 'الصَّبْرُ عَلَى الطَّاعَةِ أَشَقُّ مِنَ الصَّبْرِ عَنِ الْمَعْصِيَةِ وَالصَّبْرُ عَلَى الْبَلَاءِ أَيْسَرُ مِنَ الصَّبْرِ عَلَى الطَّاعَةِ',
      terjemahan: 'Sabar dalam ketaatan lebih berat daripada sabar dari kemaksiatan. Dan sabar dalam menghadapi musibah lebih mudah dari sabar dalam ketaatan.',
      penjelasan: 'Ada tiga tingkat kesabaran. Paling mudah adalah sabar menghadapi musibah — karena jiwa terdorong oleh naluri. Lebih berat adalah sabar menahan diri dari kemaksiatan. Yang paling berat adalah sabar dalam menjalankan ketaatan secara terus-menerus dengan penuh kehadiran hati. Inilah puncak kesabaran.'
    },
    {
      id: 'h-035', babId: babSyukur.id, num: 35,
      title: 'Hikam 35 — Syukur atas Musibah',
      arabic: 'الْبَلَاءُ مِنَ الْوَلِيِّ كَرَامَةٌ وَمِنَ الْعَدُوِّ عُقُوبَةٌ',
      terjemahan: 'Musibah dari sisi Wali (kekasih Allah) adalah kemuliaan, sedangkan dari sisi musuh adalah hukuman.',
      penjelasan: 'Musibah yang sama dapat memiliki makna yang berbeda tergantung kepada siapa yang mengalaminya. Bagi kekasih Allah, musibah adalah ujian yang memuliakan, pemurni yang membersihkan, dan tangga yang meninggikan derajat. Bagi orang yang jauh dari Allah, musibah adalah hukuman dan peringatan untuk kembali.'
    },
    {
      id: 'h-036', babId: babSyukur.id, num: 36,
      title: 'Hikam 36 — Syukur yang Menambah Nikmat',
      arabic: 'الشُّكْرُ قَيْدُ النِّعَمِ الْمَوْجُودَةِ وَصَيْدُ النِّعَمِ الْمَفْقُودَةِ',
      terjemahan: 'Syukur adalah tali yang mengikat nikmat yang sudah ada dan jaring yang menangkap nikmat yang belum ada.',
      penjelasan: 'Syukur memiliki dua fungsi sekaligus: menjaga nikmat yang telah dimiliki agar tidak pergi, sekaligus menarik nikmat-nikmat baru yang belum datang. Allah berfirman bahwa jika bersyukur, niscaya Dia akan menambah nikmat. Maka syukur adalah investasi terbaik dalam kehidupan seorang mukmin.'
    },
    {
      id: 'h-037', babId: babSyukur.id, num: 37,
      title: 'Hikam 37 — Bersyukur atas Kekurangan',
      arabic: 'إِيَّاكَ أَنْ تَنْظُرَ إِلَى صِغَرِ الذَّنْبِ وَلَكِنِ انْظُرْ إِلَى عَظَمَةِ مَنْ عَصَيْتَهُ',
      terjemahan: 'Waspadalah terhadap memandang kecilnya dosa, tetapi lihatlah kepada kebesaran Dzat yang kamu durhakai.',
      penjelasan: 'Tidak ada dosa yang kecil jika dilihat dari siapa yang didurhakai. Allah adalah Dzat Yang Mahaagung, maka mendurhakai-Nya adalah perkara yang sangat besar, apapun wujud kedurhakaan itu. Kesadaran ini akan menumbuhkan taubat yang sungguh-sungguh dari setiap perbuatan dosa, besar maupun kecil.'
    },
    {
      id: 'h-038', babId: babSyukur.id, num: 38,
      title: 'Hikam 38 — Makna di Balik Ujian',
      arabic: 'مَا أَوْجَدَكَ فِي الْكَوْنِ إِلَّا لِيَشْهَدَ فِيكَ الصِّفَاتِ وَيُظْهِرَ فِيكَ الْآيَاتِ',
      terjemahan: 'Allah tidak menciptakanmu di alam ini melainkan agar Dia menyaksikan sifat-sifat-Nya pada dirimu dan menampakkan ayat-ayat-Nya melaluimu.',
      penjelasan: 'Manusia adalah manifestasi dari nama dan sifat-sifat Allah. Setiap pribadi adalah cermin yang memantulkan keindahan-Nya dengan cara yang unik. Ujian, karunia, dan seluruh perjalanan hidup adalah media untuk menghadirkan penampakan sifat-sifat ilahi, baik Rahman, Rahim, Jabbar, maupun Lathif.'
    },

    // ── BAB 7: TAUBAT & HARAPAN ──
    {
      id: 'h-039', babId: babTaubat.id, num: 39,
      title: 'Hikam 39 — Pintu Taubat',
      arabic: 'مَا تَرَكَ الذَّنْبَ خَوْفًا مِنَ اللهِ إِلَّا صَادِقٌ وَلَا تَابَ حُبًّا لِلَّهِ إِلَّا عَارِفٌ',
      terjemahan: 'Tidaklah meninggalkan dosa karena takut kepada Allah kecuali orang yang jujur. Dan tidaklah bertaubat karena cinta kepada Allah kecuali orang yang arif.',
      penjelasan: 'Ada dua motivasi meninggalkan dosa yang bernilai tinggi. Yang pertama dan lebih umum adalah rasa takut kepada Allah — ini tanda kejujuran iman. Yang kedua dan lebih tinggi adalah rasa cinta kepada Allah — meninggalkan dosa karena tidak ingin mengecewakan yang dicintai. Inilah taubatnya para arifin.'
    },
    {
      id: 'h-040', babId: babTaubat.id, num: 40,
      title: 'Hikam 40 — Harapan kepada Allah',
      arabic: 'لَوْلَا مَيَادِينُ النُّفُوسِ مَا تَحَقَّقَتِ الدَّعَاوَى لِلسَّالِكِينَ',
      terjemahan: 'Seandainya tidak ada medan-medan nafsu, tidak akan terbukti pengakuan-pengakuan para pejalan spiritual.',
      penjelasan: 'Nafsu dan godaan bukan semata hambatan, melainkan juga arena pembuktian. Tanpa adanya nafsu yang harus dilawan, pengakuan seseorang telah mencapai maqam tertentu tidak akan pernah teruji. Allah memberikan nafsu bukan untuk menghancurkan hamba, tetapi untuk membuktikan dan meninggikan derajat mereka yang berhasil mengatasinya.'
    },
    {
      id: 'h-041', babId: babTaubat.id, num: 41,
      title: 'Hikam 41 — Taubat yang Diterima',
      arabic: 'إِذَا أَرَدْتَ أَنْ تَعْلَمَ قَدْرَكَ عِنْدَهُ فَانْظُرْ فِيمَا يُقِيمُكَ',
      terjemahan: 'Jika kamu ingin mengetahui kedudukanmu di sisi Allah, maka lihatlah dalam hal apa Allah mendudukkanmu.',
      penjelasan: 'Kondisi yang Allah tempatkan pada diri seseorang — apakah dalam ketaatan atau kelalaian, dalam ilmu atau kebodohan, dalam kemudahan atau kesulitan — adalah cerminan kedudukan seseorang di sisi-Nya saat itu. Ini bukan untuk memupuk rasa puas diri, melainkan untuk muhasabah dan terus meningkatkan kualitas diri.'
    },
    {
      id: 'h-042', babId: babTaubat.id, num: 42,
      title: 'Hikam 42 — Dosa yang Membawa Kebaikan',
      arabic: 'رُبَّمَا كَانَتِ الْمَعْصِيَةُ أَنْفَعَ لَكَ مِنَ الطَّاعَةِ إِذَا أَوْرَثَتْكَ ذُلًّا وَانْكِسَارًا',
      terjemahan: 'Terkadang sebuah kemaksiatan lebih bermanfaat bagimu daripada ketaatan, apabila kemaksiatan itu mewariskan kehinaan dan kepecahan hati (yang mendorong taubat).',
      penjelasan: 'Ini bukan pembenaran untuk bermaksiat, melainkan penghiburan bagi yang terjatuh. Terkadang seseorang jatuh dalam dosa lalu merasakan kepedihan mendalam, dan kepedihan itu mendorongnya bertaubat dan kembali kepada Allah dengan lebih sungguh-sungguh dari sebelumnya. Ini lebih baik daripada ketaatan yang membuatnya sombong.'
    },
    {
      id: 'h-043', babId: babTaubat.id, num: 43,
      title: 'Hikam 43 — Kembali kepada Allah',
      arabic: 'إِيَّاكَ أَنْ تُؤَخِّرَ التَّوْبَةَ لِاسْتِكْمَالِ الشَّهَوَاتِ فَإِنَّ ذَلِكَ مِنْ أَعْظَمِ خُدَعِ الشَّيْطَانِ',
      terjemahan: 'Waspadalah terhadap menunda taubat karena ingin menghabiskan syahwat terlebih dahulu, karena itu termasuk tipu daya setan yang paling besar.',
      penjelasan: 'Setan menggoda manusia untuk terus menunda taubat dengan berkata "taubatlah nanti setelah ini." Namun tidak ada seorangpun yang tahu kapan kematiannya tiba. Menunda taubat adalah salah satu jebakan setan yang paling berbahaya karena terasa masuk akal namun mengandung risiko yang sangat besar.'
    },

    // ── BAB 8: RAHMAT & UJIAN ──
    {
      id: 'h-044', babId: babRahmat.id, num: 44,
      title: 'Hikam 44 — Rahmat Allah yang Luas',
      arabic: 'مَا وَسِعَتِ الْأَرْضُ وَالسَّمَاءُ رَحْمَتَهُ وَوَسِعَهَا قَلْبُ عَبْدِهِ الْمُؤْمِنِ',
      terjemahan: 'Bumi dan langit tidak mampu menampung rahmat-Nya, namun rahmat itu tertampung dalam hati hamba-Nya yang beriman.',
      penjelasan: 'Hati seorang mukmin memiliki kapasitas rohani yang melampaui kapasitas fisik alam semesta. Bumi dan langit hanya mampu menampung ciptaan yang bersifat fisik, sedangkan hati mampu menampung cahaya, kasih sayang, dan rahmat ilahi yang bersifat transenden. Inilah keagungan manusia yang beriman.'
    },
    {
      id: 'h-045', babId: babRahmat.id, num: 45,
      title: 'Hikam 45 — Ujian sebagai Kemurahan',
      arabic: 'مَا أَنْزَلَ اللهُ بَلَاءً إِلَّا وَفِيهِ نِعْمَةٌ خَفِيَّةٌ وَمَا رَفَعَ نِعْمَةً إِلَّا وَفِيهَا بَلَاءٌ مُضْمَرٌ',
      terjemahan: 'Allah tidak menurunkan musibah melainkan di dalamnya terdapat nikmat tersembunyi. Dan Allah tidak mengangkat nikmat melainkan di dalamnya terdapat musibah yang tersimpan.',
      penjelasan: 'Realitas kehidupan tidak sesederhana yang tampak. Setiap musibah mengandung nikmat tersembunyi — pelajaran, pemurnian, kenaikan derajat, atau pendekatan kepada Allah. Sebaliknya, setiap nikmat menyimpan ujian tersembunyi — godaan, kelalaian, atau ketergantungan kepada selain Allah. Maka bijaksanalah dalam menyikapi keduanya.'
    },
    {
      id: 'h-046', babId: babRahmat.id, num: 46,
      title: 'Hikam 46 — Pandangan Allah kepada Hamba',
      arabic: 'حُسْنُ ظَنِّكَ بِاللهِ هُوَ الَّذِي يُطَيِّبُ قَلْبَكَ فَكَيْفَ تَطِيبُ رُوحُكَ وَأَنْتَ لَا تُحْسِنُ الظَّنَّ بِرَبِّكَ',
      terjemahan: 'Prasangka baikmu kepada Allah adalah yang membuat hatimu menjadi baik. Maka bagaimana mungkin jiwamu menjadi baik sementara kamu tidak berprasangka baik kepada Tuhanmu.',
      penjelasan: 'Husnuzhon kepada Allah adalah fondasi ketenangan jiwa. Ketika seseorang percaya bahwa Allah Maha Baik dan selalu menghendaki kebaikan bagi hamba-Nya, hati menjadi tentram bahkan di tengah ujian terberat. Sebaliknya, suuzhon kepada Allah adalah sumber kegelisahan yang tiada habisnya.'
    },
    {
      id: 'h-047', babId: babRahmat.id, num: 47,
      title: 'Hikam 47 — Keajaiban Orang yang Kafir Nikmat',
      arabic: 'عَجِبْتُ لِمَنْ يَطْلُبُ شَيْئًا وَقَدْ وُجِدَ فِيهِ ذَلِكَ الشَّيْءُ',
      terjemahan: 'Aku heran kepada orang yang mencari sesuatu padahal di dalam dirinya sudah terdapat sesuatu itu.',
      penjelasan: 'Banyak manusia mencari kebahagiaan, kedamaian, dan makna hidup di luar dirinya, padahal semua itu telah Allah titipkan di dalam fitrahnya. Manusia mencari cahaya di luar padahal cahaya itu ada di dalam hatinya. Pencarian yang benar adalah perjalanan ke dalam diri, bukan pelarian keluar.'
    },
    {
      id: 'h-048', babId: babRahmat.id, num: 48,
      title: 'Hikam 48 — Kasih Sayang dalam Setiap Takdir',
      arabic: 'لَا تَعْجَبْ مِنْ وُقُوعِ الْأَحْزَانِ مَا دُمْتَ فِي دَارِ الدُّنْيَا فَإِنَّهَا لَا تُظْهِرُ إِلَّا مَا هُوَ مُقْتَضَى وَصْفِهَا وَطَبِيعَةُ أَرْضِهَا',
      terjemahan: 'Janganlah heran dengan datangnya kesedihan selama kamu masih berada di dunia, karena dunia hanya menampakkan apa yang merupakan tuntutan sifatnya dan tabiat dasarnya.',
      penjelasan: 'Dunia adalah tempat persinggahan yang memang tidak dirancang untuk kesempurnaan dan kesenangan abadi. Kesedihan, kesulitan, dan kelelahan adalah bagian dari karakter dunia. Mengeluh terhadap ini seperti mengeluh karena laut itu asin. Yang bijaksana adalah menerima sifat dunia dan menyiapkan diri untuk kehidupan yang kekal.'
    },
    {
      id: 'h-049', babId: babRahmat.id, num: 49,
      title: 'Hikam 49 — Tanda Cinta yang Benar',
      arabic: 'مَنْ أَحَبَّكَ نَهَاكَ وَمَنْ أَرَادَ الدُّنْيَا مِنْكَ مَدَحَكَ',
      terjemahan: 'Orang yang mencintaimu akan melarangmu (dari yang buruk), sedangkan orang yang menginginkan dunia darimu akan memujimu.',
      penjelasan: 'Cinta yang sejati terkadang tampak keras karena mencegah dari hal yang membahayakan. Sementara orang yang memuji tanpa batas seringkali bermotif kepentingan duniawi. Maka jangan terkecoh oleh pujian yang berlebihan, dan jangan salah memahami nasihat sebagai permusuhan.'
    },
    {
      id: 'h-050', babId: babRahmat.id, num: 50,
      title: 'Hikam 50 — Akhir Perjalanan',
      arabic: 'نِهَايَةُ الْعَارِفِ الِانْقِطَاعُ إِلَى اللهِ وَبِدَايَتُهُ كَذَلِكَ',
      terjemahan: 'Tujuan akhir seorang arif adalah memutuskan diri sepenuhnya kepada Allah, dan awalnya pun demikian.',
      penjelasan: 'Perjalanan rohani dimulai dan diakhiri dengan satu hal yang sama: kembali dan berserah sepenuhnya kepada Allah. Di awal perjalanan, seorang murid belajar untuk melepaskan keterikatan pada dunia dan bergantung hanya kepada Allah. Di puncak perjalanan, ia mewujudkan hal yang sama dengan lebih sempurna. Maka ujung dan awal bertemu dalam satu titik: Allah SWT.'
    },
  ]

  for (const h of hikamList) {
    await prisma.materi.upsert({
      where: { id: h.id },
      update: {},
      create: {
        id: h.id, babId: h.babId, title: h.title, orderNum: h.num,
        content: {
          type: 'hikam',
          number: h.num,
          arabic: h.arabic,
          terjemahan: h.terjemahan,
          penjelasan: h.penjelasan,
          ...(h.referensi ? { referensi: h.referensi } : {})
        }
      }
    })
  }

  console.log('✅ Seeding selesai!')
  console.log('   📖 Al-Quran Al-Karim — 3 surah, 11 ayat')
  console.log('   📜 Al-Hikam — 8 bab, 50 hikam')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())