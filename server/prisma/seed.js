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
      terjemahan: '"Di antara tanda-tanda bergantung pada amal adalah berkurangnya harapan kepada Allah ketika terjadi kesalahan."',
      penjelasan: 'Syaikh Ibnu Atha\'illah mengajarkan bahwa orang yang benar-benar bertawakal tidak akan putus asa ketika berbuat salah. Keputusasaan menunjukkan bahwa seseorang lebih bergantung pada amalnya daripada kepada rahmat Allah. Seorang mukmin sejati selalu memperbaharui harapannya kepada Allah.',
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 1 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1imEJfpf-psQRBvaAU7cIR3KYfiKqLA6k/view?usp=sharing'
      }
    },
    {
      id: 'h-002', babId: babTawakkal.id, num: 2,
      title: 'Hikam 2 — Tajrid dan Kasab',
      arabic:`إِرَ ادَ تُــكَ الـتَّجْرِ يْدَ مَـعَ إِقَامَـةِ اللَّهِ إِ يَّـاكَ فيِ اْلأَسْبَابِ مِنَ الشَّـهْـوَ ةِ الْخَفِـيـَّةِ.
وَ إِرَادَ تُـكَ اْلأَسْبَابَ مَعَ إِقَامَةِ اللَّهِ إِ يَّـاكَ فيِ الـتَّجْرِ يْدِ اِنحِطَاطٌ مِنَ الْهِمَّةِ الْعَـلِـيـَّةِ`,
      terjemahan: `"Keinginanmu untuk tajrid (meninggalkan keinginan duniawi, termasuk mencari rezeki) padahal Allah telah menetapkan engkau pada asbab (usaha, dimana allah telah membekali manusia dengan sarana penghidupan), adalah termasuk dalam bisikan syahwat yang samar. Sebaliknya, keinginanmu untuk melakukan asbab padahal Allah telah menempatkanmu pada kedudukan tajrid, adalah suatu kemerosotan dari himmah (tekad spiritual) yang luhur."`,
      penjelasan: 'Setiap orang memiliki kedudukan yang telah ditentukan Allah. Keinginan meninggalkan posisi itu tanpa izin Allah justru merupakan mengikuti hawa nafsu yang tersembunyi. Terimalah posisimu dan jalankan dengan ikhlas.',
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 2 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1imEJfpf-psQRBvaAU7cIR3KYfiKqLA6k/view?usp=sharing'
      }
    },
    {
      id: 'h-003', babId: babTawakkal.id, num: 3,
      title: 'Hikam 3 — Tembok Takdir',
      arabic: 'سَوَابِقُ الْهِمَمِ لَا تَخْرِقُ أَسْوَارَ الْأَقْدَارِ',
      terjemahan: '"Kehendak-kehendak yang kuat tidak dapat menembus tembok-tembok takdir."',
      penjelasan: 'Manusia boleh berusaha sekuat tenaga, namun pada akhirnya takdir Allah-lah yang menentukan. Bukan mengajak kepasifan, melainkan mengajarkan kerendahan hati. Berusahalah semaksimal mungkin, namun serahkan hasilnya kepada Allah SWT.',
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 3 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1imEJfpf-psQRBvaAU7cIR3KYfiKqLA6k/view?usp=sharing'
      }
    },
    {
      id: 'h-004', babId: babTawakkal.id, num: 4,
      title: 'Hikam 4 — Mengistirahatkan Diri Dari Keinginan Mengatur',
      arabic: 'أَرِحْ نــَفْسَـكَ مِنَ الـتَّدْبِــيْرِ، فَمَا قَامَ بِـهِ غَيْرُ كَ عَـنْكَ لاَ تَـقُمْ بِـهِ لِنَفْسِكَ',
      terjemahan: '"Istirahatkan dirimu dari melakukan Tadbir (mengatur urusan duniawi) dengan susah payah. Karena, sesuatu yang telah diurus untukmu oleh selain dirimu (sudah diurus oleh Allah), tidak perlu engkau turut mengurusnya."',
      penjelasan: 'Allah SWT telah menjamin rezeki dan urusan setiap makhluk-Nya. Ketika hamba terlalu sibuk mengatur hidupnya sendiri, ia sesungguhnya tidak mempercayai jaminan Allah. Bertawakallah dengan sepenuh hati.',
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 4 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1YhMPlX_8-n_ffr4HtEWYKu41R6CuuNSF/view?usp=sharing'
      }
    },
    {
      id: 'h-005', babId: babTawakkal.id, num: 5,
      title: 'Hikam 5 — Mata Hati yang Buta',
      arabic:'اِجْتِهَادُكَ فِيمَا ضُمِنَ لَكَ، وَ تـَقْصِيْرُكَ فِيمَا طُلِبَ مِنْكَ، دَ لِيلٌ عَلَى انـــْطِمَاسِ الْــبَصِيْرةِ مِنْكَ',
      terjemahan: '"Kesungguhamnu mengejar (dunia ) apa yang sudah dijamin untukmu (oleh Allah) dan kelalaianmu melaksanakan apa yang dibebankan kepadamu (ibadah), itu merupakan tanda butanya bashirah (mata batin)"',
      penjelasan: 'Ketika menerima pemberian dari sesama manusia, seorang arif tetap melihat bahwa hakikatnya Allah-lah yang memberi melalui perantara tersebut. Hatinya tidak terikat pada pemberi, tidak merasa terhutang budi kepada selain Allah.',
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 5 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1YhMPlX_8-n_ffr4HtEWYKu41R6CuuNSF/view?usp=sharing'
      }
    },
    {
      id: 'h-006', babId: babTawakkal.id, num: 6,
      title: 'Hikam 6 — Allah Yang Menjamin Terkabulnya Doa',
      arabic: 'لاَ يَــكُنْ تَــأَخُّرُ أَ مَدِ الْعَطَاءِ مَعَ اْلإِلْـحَـاحِ فيِ الدُّعَاءِ مُوْجِـبَاً لِـيَأْسِكَ؛ فَـهُـوَ ضَمِنَ لَـكَ اْلإِجَـابَـةَ فِيمَا يَـخْتَارُهُ لَـكَ لاَ فِيمَا تَـختَارُ لِـنَفْسِكَ؛ وَفيِ الْـوَقْتِ الَّـذِيْ يُرِ يـْدُ لاَ فيِ الْـوَقْتِ الَّذِي تُرِ يدُ',
      terjemahan: '"Terlambat datangnya pemberian (Allah), meski sudah dimohonkan berulang-ulang, janganlah buatmu patah harapan. Karena dia telah menjamin untuk mengabulkan permintaanmu sesuai dengan apa yang Dia pilihkan untukmu, bukan menurut keinginan engkau sendiri. Juga dalam waktu yang Dia kehendaki, bukan pada waktu yang engkau inginkan"',
      penjelasan: 'Orang yang menunjuk-nunjuk pencapaian spiritual dan pengalaman rohaninya kepada orang lain, berarti ia belum melepaskan diri dari keakuan. Kerendahan hati yang sejati adalah tidak merasakan bahwa dirinya memiliki sesuatu yang bisa dibanggakan.',
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 6 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1YhMPlX_8-n_ffr4HtEWYKu41R6CuuNSF/view?usp=sharing'
      }
    },
    {
      id: 'h-007', babId: babTawakkal.id, num: 7,
      title: 'Hikam 7 — Keraguan Akan Mematikan Cahaya Hati',
      arabic: 'لاَ يـُشَـكِّكَــنَّكَ فيِ الْـوَعْدِ عَدَمُ وُقُــوْعِ الْـمَـوْعُـوْدِ ، وَ إِنْ تَـعَـيَّنِ زَمَنُهُ ؛ لِئَـلاَّ يـَكُوْنَ ذَ لِكَ قَدْحًـا فيِ بَـصِيْرَ تِـك, وَ إِخْمَـادً ا لِـنُورِ سَرِ يـْرَ تِـكَ',
      terjemahan: 'Bagaimana mungkin hati dapat bersinar sementara gambaran-gambaran dunia terukir dalam cermin nuraninya?',
      penjelasan: `1. Jangan meragukan janji Alloh karena sejatinya semuanya sudah diatur dengan kesempurnaan 
      2. Bagi manusia yang menerima apapun keputusan Alloh bagi hidupnya akan memandang indah semuanya
      3. Keyakinan tanpa ragu akan kebenaran ijabah akan membuat mata hati tak kan terluka dan tak kan membuat padam nurani`,
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 7 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1J3A5Kzzx_gOGn1_8jtMwff8PR7T0cvcX/view?usp=drive_link'
      }
    },
    {
      id: 'h-008', babId: babTawakkal.id, num: 8,
      title: 'Hikam 8 — Amal, Berserah Diri dan Ma’rifat',
      arabic: 'إِذَا فَتَحَ لَـكَ وِجْهَةً مِنَ التَّعَرُّفِ فَلاَ تُبــَالِ مَعَهَا أِنْ قَلَّ عَمَلُكَ فَإِنَّـهُ مَا فَـتَـحَهَا لَكَ إِلاَّ وَهُوَ يُرِ يْدُ أَنْ يَـتَـعَرَّفَ إِلَيكَ. أَلَمْ تَـعْلَمْ أَنَّ الـتَّــعَرُّفَ هُوَ مُوْرِدُهُ عَلَيْكَ، وَاْلأَعْمَالُ أَنْتَ مُــهْدِ يْــهَا إِلَـيْهِ، وَأَيــْنَ مَا تُــهْدِ يْهِ إِلَـيْهِ مِمَّا هُـوَ مُوْرِدُهُ عَلَـيْكَ',
      terjemahan: '"Apabila Allah telah membukakan salah satu jalan makrifat (mengenal Allah) bagimu, maka jangan hiraukan mengapa itu terjadi, walaupun amalmu masih sangat sedikit. Allah membukakan pintu itu bagimu hanyalah karena Dia ingin memperkenalkan diri kepadamu. Tidakkah engkau mengerti, bahwa makrifat itu merupakan anugrah-Nya kepadamu, Sedang engkau mempersembahkan amal-amalmu kepada-Nya.? Maka apalah arti apa yang engkau persembahkan kepada-Nya itu dengan apa yang dianugrahkan oleh Allah kepadamu."',
      penjelasan: `1.Alloh SWT membukakan pintu ma'rifat (mengenal keagunganNya) pada siapapun yang Dia kehendaki
      2. Jika dalam nurani ada rasa untuk semakin dekat dengan Nya melalui Amaliyyah ibadah. Jangan diabaikan.. Rawatlah dan upayakan untuk menyambutnya dengan Mujahadah ( upaya maksimal mengamalkannya)`,
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 8 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1J3A5Kzzx_gOGn1_8jtMwff8PR7T0cvcX/view?usp=drive_link'
      }
    },

    // ── BAB 2: MA'RIFAT & IKHLAS ──
    {
      id: 'h-009', babId: babMakrifat.id, num: 9,
      title: 'Hikam 9 — Amal, Ahwal dan Warid',
      arabic: 'تَـنَوَّعَتْ أَجْنَاسُ اْلأَعْمَالِ لِـتَـنَوُّعِ وَارِدَاتِ اْلأَحْوَالِ ',
      terjemahan: '"Beragamnya jenis amal-amal itu disebabkan oleh beragamnya warid-warid (yang turun) pada ahwal-ahwal (hamba-Nya)."',
      penjelasan: ` 1. Ada wirid dan ada warid
      2. Wirid adalah amal baik yang dibiasakan
      3. Warid adalah pengaruh baik dari wirid
      4. Alloh menghadirkan banyak amal sebagai wirid manusia karena kondisi manusia yang beragam dan Alloh menganugerahkan banyak warid dalam kehidupan manusia`,
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 9 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1J3A5Kzzx_gOGn1_8jtMwff8PR7T0cvcX/view?usp=drive_link'
      }
    },
    {
      id: 'h-010', babId: babMakrifat.id, num: 10,
      title: 'Hikam 10 — CAHAYA IKHLAS',
      arabic: 'الأَعْمَالُ صُوَرٌ قَائِمَةٌ وَأَرْوَاحُهَا وُجُودُ سِرِّ الإِخْلَاصِ فِيهَا',
      terjemahan: '"Amal-amal itu semata bentuk-bentuk yang tampil, adapun ruh-ruh yang menghidupkannya adalah hadirnya sirr ikhlas (cahaya ikhlas) padanya"',
      penjelasan:`Amal adalah bentuk lahir, ikhlas adalah ruhnya
      1. Amal ibadah tidak cukup hanya benar secara lahiriah.
      2. Amal akan bernilai di sisi Allah jika disertai niat yang ikhlas.
      3. Ikhlas menjadi ruh yang menghidupkan setiap amal.
      4. Tanpa ikhlas, amal bisa tampak besar tetapi kosong nilainya.
      5. Pesan utama: perbaiki niat sebelum, saat, dan setelah beramal.`,
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 10 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1Tho_MJWU0wSPa0Ke4kAi5AYR7pfgYEn5/view?usp=drive_link'
      }
    },
    {
      id: 'h-011', babId: babMakrifat.id, num: 11,
      title: 'Hikam 11 — Kuburlah Eksistensimu! Tanamlah dirimu dalam tempat yang tersembunyi',
      arabic: 'اِدْفِنْ وُجُودَكَ فيِ أَرْضِ الْخُمُولِ، فَمَا نَـبَتَ مِمَّالَمْ يُدْفَنْ لاَ يَــتِمُّ نَـتَاءِجُهُ',
      terjemahan: '"Kuburlah wujudmu (eksistensimu) di dalam bumi kerendahan (ketiadaan); maka segala yang tumbuh namun tidak ditanam (dengan baik) tidak akan sempurna buahnya."',
      penjelasan: `Tanamlah dirimu dalam tempat yang tersembunyi
      1. Seorang salik tidak perlu sibuk menampakkan diri kepada manusia.
      2. Kemuliaan tidak lahir dari popularitas, tetapi dari kedekatan kepada Allah.
      3. Amal yang tersembunyi lebih terjaga dari riya dan ujub.
      4. Proses pertumbuhan ruhani sering kali justru kuat saat dijalani dalam diam.
      5. Pesan utama: jadilah hamba yang tumbuh dalam ketulusan, bukan pencitraan.`,
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 11 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1Tho_MJWU0wSPa0Ke4kAi5AYR7pfgYEn5/view?usp=drive_link'
      }
    },
    {
      id: 'h-012', babId: babMakrifat.id, num: 12,
      title: 'Hikam 12 — Uzlah dan Tafakur',
      arabic: 'مَا نَـفَعَ الْقَلْبَ مِثْلَ عُزْلَةٍ يَدْخُلُ بِهَا مِيْدَانَ فِكْرَةٍ',
      terjemahan: '"Tidak ada sesuatu pun yang lebih membawa manfaat bagi qalb sebagaimana uzlah, yang dengan (uzlahnya) itu masuk ke medan tafakkur."',
      penjelasan: `Tidak ada yang lebih bermanfaat bagi hati selain uzlah
      1. Uzlah membantu ha􀆟 keluar dari keramaian yang melalaikan.
      2. Dengan menyendiri untuk tafakur, ha􀆟 menjadi lebih tenang dan jernih.
      3. Uzlah membuka ruang untuk muhasabah dan memperbaiki hubungan dengan Allah.
      4. Pikiran menjadi lebih luas karena 􀆟dak terus dipenuhi gangguan dunia.
      5. Pesan utama: ha􀆟 membutuhkan keheningan agar mampu menerima cahaya hikmah.`,
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 12 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/1Tho_MJWU0wSPa0Ke4kAi5AYR7pfgYEn5/view?usp=drive_link'
      }
    },
    {
      id: 'h-013', babId: babMakrifat.id, num: 13,
      title: 'Hikam 13 — Hati yang Ingin Bercahaya',
      arabic: 'كَيْفَ يَشْرُقُ قَلْبٌ صُوَرُ اْلأَكْوَانِ مـُــنْطَبِعَةٌ فيِ مِرْآتِهِ، أَمْ كَيْفَ يَرْحَلُ إِلىَ اللَّهِ وَهُوَ مُكَبَّلٌ بشِهَوَاتِهِ، أَمْ كَيْفَ يَطْمَعُ أَنْ يَدْخُلَ حَضْرَةَ اللَّهِ وَهُوَ لَمْ يَـتَطَهَّرْ مِنْ جَنَابَةِ غَفَلاتِهِ أَمْ كَيْفَ يَرْجُوْ أَنْ يَفْهَمَ دَقَائِقَ اْلأَسْرَارِ وَهُوَ لَمْ يَـتـُبْ مِنْ هَفَوَاتِهِ',
      terjemahan: '"Bagaimana mungkin hati bisa bersinar (terang bercahaya), sementara gambaran-gambaran dunia masih tercetak di cerminnya? Atau bagaimana mungkin ia bisa melakukan perjalanan menuju Allah, sementara ia masih dibelenggu oleh syahwat (hawa nafsu)-nya? Atau bagaimana mungkin ia berambisi masuk ke hadirat Allah, sementara ia belum bersuci dari junub-nya kelalaian? Atau bagaimana mungkin ia berharap memahami rahasia-rahasia yang halus (sirr), sementara ia belum bertobat dari kesalahan-kesalahannya?"',
      penjelasan: `1. Hati sulit bercahaya jika masih dipenuhi bayangan dunia.
      2. Perjalanan menuju Allah akan terhalang oleh ikatan syahwat.
      3. Ibadah membutuhkan ha􀆟 yang bersih dari kelalaian.
      4. Memahami rahasia Ilahi memerlukan taubat dan penyucian diri.`,
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 13 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/19U48OUMx1yx7WEUenujm0bU7eH1gRI_n/view?usp=drive_link'
      }
    },
    {
      id: 'h-014', babId: babMakrifat.id, num: 14,
      title: 'Hikam 14 — Alam Menjadi Terang Karena Allah',
      arabic:'الْكَوْنُ كُلُّهُ ظُلْمَةٌ وَ إِنَّمَا أَنَارَهُ ظُهُوْرُ الْحَقِّ فِيْهِ فَمَنْ رَأَى الْكَوْنَ وَ لَمْ يَشْهَدْهُ فِيْهِ أَوْ عِنْدَهُ أَوْ قَبْلَهُ أَوْ بَعْدَهُ فَقَدْ أَعْوَزَهُ وُجُوْدُ الْأَنْوَارِ وَ حُجِبَتْ عَنْهُ شُمُوْسُ الْمَعَارِفِ بِسُحُبِ الْآثَارِ',
      terjemahan: '"Seluruh semesta adalah kegelapan, Sesungguhnya ia diterangi kemunculan al-Ḥaqq/Allah di dalamnya, Maka siapa yang melihat semesta dan tidak menyaksikan Dia di dalamnya, di sisinya, sebelumnya, atau sesudahnya maka ia telah disamarkan oleh wujud cahaya. Dan awan ciptaan menghalanginya dari matahari makrifat."',
      penjelasan: `1.	Alam pada hakikatnya gelap tanpa cahaya Allah.
      2.	Semua yang terlihat seharusnya menjadi tanda kehadiran Allah.
      3.	Orang yang hanya melihat benda lahiriah akan kehilangan cahaya makrifat.
      4.	Dunia bisa menjadi jalan mengenal Allah, tetapi juga bisa menjadi hijab bila berhenti pada bentuknya saja.`,
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 14 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/19U48OUMx1yx7WEUenujm0bU7eH1gRI_n/view?usp=drive_link'
      }
    },
    {
      id: 'h-015', babId: babMakrifat.id, num: 15,
      title: 'Hikam 15 — Hijab Dari yang Maha Nyata',
      arabic: 'مِمَّا يَدُلُّكَ عَلَى وُجُودِ قَهْرِهِ سُبْحَانَهُ، أَنْ حَجَبَكَ عَنْهُ بِمَا لَيْسَ بِمَوْجُودٍ مَعَهُ',
      terjemahan: '"Di antara bukti yang menunjukkan atas kekuasaan-Nya yang memaksa (Subhaanahu) adalah Dia menutup dirimu dari-Nya dengan sesuatu yang sebenarnya tidak ada bersama-Nya (makhluk/dunia)"',
      penjelasan: `1.	Allah Maha Nyata, tetapi manusia bisa terhalang oleh pandangannya sendiri.
      2.	Hijab bukan karena Allah jauh, tetapi karena hati belum bersih.
      3.	Sesuatu yang tidak hakiki dapat menghalangi manusia dari Yang Maha Hakiki.
      4.	Kuncinya adalah membersihkan hati, memperkuat taubat, dan melihat alam sebagai tanda Allah.`,
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 15 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/19U48OUMx1yx7WEUenujm0bU7eH1gRI_n/view?usp=drive_link'
      }
    },
    {
      id: 'h-016', babId: babMakrifat.id, num: 16,
      title: 'Hikam 16 — Allah Tidak Bisa Terhijab',
      arabic: `كَيْفَ يَتَصَوَّرُ أَنْ يَحْجُبَهُ شَيْءٌ وَهُوَ الَّذِيْ أَظْهَرَ كُلَّ شَيْءٍ.
كَيْفَ يَتَصَوَّرُ أَنْ يَحْجُبَهُ شَيْءٌ وَهُوَ الَّذِيْ ظَهَرَ بِكُلِّ شَيْءٍ.
كَيْفَ يَتَصَوَّرُ أَنْ يَحْجُبَهُ شَيْءٌ وَهُوَ الَّذِيْ ظَهَرَ فِيْ كُلِّ شَيْءٍ.
كَيْفَ يَتَصَوَّرُ أَنْ يَحْجُبَهُ شَيْءٌ وَهُوَ الَّذِيْ ظَهَرَ لِكُلِّ شَيْءٍ.
كَيْفَ يَتَصَوَّرُ أَنْ يَحْجُبَهُ شَيْءٌ وَهُوَ الَّذِيْ الظَاهِرُ قَبْلَ وُجُوْدِ كُلِّ شَيْءٍ. كَيْفَ يَتَصَوَّرُ أَنْ يَحْجُبَهُ شَيْءٌ وَهُوَ الَّذِيْ أظْهَِرُ مِنْ كُلِّ شَيْءٍ.
كَيْفَ يَتَصَوَّرُ أَنْ يَحْجُبَهُ شَيْءٌ وَهُوَ الْوَاحِدُ الَّذِيْ لَيْسَ مَعَهُ شَيْءٌ.
كَيْفَ يَتَصَوَّرُ أَنْ يَحْجُبَهُ شَيْءٌ وَهُوَ أَقْرَبُ إِلَيْكَ مِنْ كُلِّ شَيْءٍ.
كَيْفَ يَتَصَوَّرُ أَنْ يَحْجُبَهُ شَيْءٌ وَلَوْلَاهُ مَا كَانَ وُجُوْدُ كُلِّ شَيْءٍ.`,
      terjemahan: `• Bagaimana bisa dibayangkan kalau sesuatu dapat mengalingi-Nya, sementara Dialah Yang Menampakkan segala sesuatu? Bagaimana bisa dibayangkan kalau sesuatu sanggup mengaling-Nya, bila Dialah Yang Tampak pada segala sesuatu?Bagaimana bisa dibayangkan kalau sesuatu mampu mengalingi-Nya, sedangkan Dialah Yang Tampak dalam segala sesuatu?Bagaimana bisa dibayangkan kalau sesuatu kuasa mengalingi-Nya, padahal Dialah Yang Tampak untuk segala sesuatu? Bagaimana bisa dibayangkan kalau sesuatu dapat mengalingi-Nya, sementara Dialah Yang Ada sebelum ada segala sesuatu ? Bagaimana bisa dibayangkan kalau sesuatu sanggup mengalingi-Nya, bila Dia lebih jelas ketimbang segala sesuatu? Bagaimana bisa dibayangkan kalau sesuatu dapat mengalingi-Nya, sedangkan Dia Esa, yang tiada disamping-Nya sesuatu apa pun? Bagaimana bisa dibayangkan kalau sesuatu kuasa mengalingi-Nya, padahal Dia lebih dekat kepadamu daripada segala sesuatu? Bagaimana bisa dibayangkan kalau sesuatu dapat mengalingi-Nya, sementara seandainya Dia tak ada, niscaya tak akan ada segala sesuatu?Betapa ajaib, bagaimana bisa tampak dalam ketiadaan? Atau, bagaimana sesuatu yang baru bisa bersanding dengan Yang Mahadahulu`,
      penjelasan: `Hikam ini adalah rentetan pertanyaan retoris yang membuktikan mustahilnya Allah terhijab:
      1. Allah-lah yang menampakkan segala sesuatu — bagaimana yang menampakkan justru tersembunyi?
      2. Allah-lah yang tampak pada segala sesuatu — bagaimana bisa ada yang menghalangi-Nya?
      3. Allah ada sebelum segala sesuatu — bagaimana yang ada belakangan menghalangi yang lebih dahulu?
      4. Allah lebih nyata dari segala sesuatu — bagaimana yang kurang nyata menghalangi yang lebih nyata?
      5. Hijab sejatinya bukan pada Allah, melainkan pada mata hati kita yang belum bersih.`,
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 16 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/19U48OUMx1yx7WEUenujm0bU7eH1gRI_n/view?usp=drive_link'
      }
    },
    {
      id: 'h-017', babId: babTawakkal.id, num: 17,
      title: 'Hikam 17 — Menginginkan Selain Kehendak Allah adalah Kebodohan',
      arabic: 'مَا تَرَكَ مِنَ الْجَهْلِ شَيْئًا مَنْ أَرَادَ أَنْ يَحْدُثَ فِي الْوَقْتِ غَيْرَ مَا أَظْهَرَهُ اللَّهُ فِيهِ',
      terjemahan: '"Sangatlah jahil orang yang menginginkan terjadinya sesuatu di luar waktu yang dikehendaki oleh Allah."',
      penjelasan: `1. Setiap waktu memiliki takdir dan ketetapan Allah yang paling sempurna.
      2. Menginginkan kondisi berbeda dari yang Allah tampakkan adalah bentuk kebodohan spiritual.
      3. Seorang mukmin menerima setiap keadaan sebagai pilihan terbaik dari Allah.
      4. Ketidakpuasan terhadap ketetapan Allah menunjukkan lemahnya keyakinan pada hikmah-Nya.
      5. Pesan utama: ridha dengan waktu dan kondisi yang Allah berikan adalah puncak tawakkal.`,
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 17 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/19U48OUMx1yx7WEUenujm0bU7eH1gRI_n/view?usp=drive_link'
      }
    },
    {
      id: 'h-018', babId: babTawakkal.id, num: 18,
      title: 'Hikam 18 — Menunda Amal Saleh adalah Kebodohan Jiwa',
      arabic: 'إِحَالَتُكَ الْأَعْمَالَ عَلَى وُجُوْدِ الْفَرَاغِ مِنْ رُعُوْنَاتِ النَّفْسِ',
      terjemahan: '"Menunda beramal saleh guna menantikan kesempatan yang lebih luang, termasuk tanda kebodohan jiwa."',
      penjelasan: `1. Nafsu selalu mencari alasan untuk menunda amal kebaikan.
      2. Menunggu waktu luang sempurna sebelum beramal adalah jebakan setan yang halus.
      3. Waktu luang yang dinanti sering kali tidak pernah benar-benar tiba.
      4. Setiap saat adalah kesempatan beramal — sempitnya waktu bukan penghalang.
      5. Pesan utama: mulailah beramal sekarang dengan apa yang ada, jangan tunda menunggu kondisi ideal.`,
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 18 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/19U48OUMx1yx7WEUenujm0bU7eH1gRI_n/view?usp=drive_link'
      }
    },
    {
      id: 'h-019', babId: babTawakkal.id, num: 19,
      title: 'Hikam 19 — Tidak Boleh Memaksa Allah',
      arabic: 'لَا تَطْلُبْ مِنْهُ أَنْ يُخْرِجَكَ مِنْ حَالَةٍ لِيَسْتَعْمِلَكَ فِيمَا سِوَاهَا، فَلَوْ أَرَادَكَ لَاسْتَعْمَلَكَ مِنْ غَيْرِ إِخْرَاجٍ.',
      terjemahan: '"Jangan meminta kepada Allah supaya Dia mengeluarkanmu dari suatu keadaan untuk menggunakanmu pada keadaan yang lain. Karena seandainya Allah menghendaki penggunaanmu, tentulah Dia akan menggunakanmu tanpa harus mengeluarkanmu."',
      penjelasan: `1. Allah Maha Kuasa menggunakan hamba-Nya dalam kondisi apapun tanpa perlu mengubah keadaan.
      2. Meminta dipindahkan dari keadaan sebelum saatnya menunjukkan ketidakpercayaan pada pengaturan Allah.
      3. Kondisi kita saat ini adalah medan amal yang telah Allah pilihkan.
      4. Kewajiban kita adalah optimal di mana kita berada, bukan memilih di mana kita ingin berada.
      5. Pesan utama: terima posisimu sekarang dan tunaikan tugasmu di sana dengan sepenuh hati.`,
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 19 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/19U48OUMx1yx7WEUenujm0bU7eH1gRI_n/view?usp=drive_link'
      }
    },
    {
      id: 'h-020', babId: babMakrifat.id, num: 20,
      title: 'Hikam 20 — Himmah Salik Tidak Berhenti',
      arabic: 'مَا أَرَادَتْ هِمَّةُ سَالِكٍ أَنْ تَقِفَ عِنْدَ مَا كُشِفَ لَهَا إِلَّا وَنَادَتْهُ هَوَاتِفُ الْحَقِيقَةِ: الَّذِي تَطْلُبُهُ أَمَامَكَ! وَلَا تَبَرَّجَتْ ظَوَاهِرُ الْمُكَوَّنَاتِ إِلَّا وَنَادَتْهُ حَقَائِقُهَا: إِنَّا فِتْنَةٌ فَلَا تَكْفُرْ',
      terjemahan: '"Hasrat seorang salik tidak akan berhenti ketika tersingkap baginya tirai rohani, melainkan suara-suara hakikat akan berseru padanya: yang engkau cari masih di depanmu! Dan tidaklah keindahan alam semesta memperlihatkan dirinya, melainkan hakikatnya berseru: kami hanyalah ujian, maka janganlah engkau kufur."',
      penjelasan: `1. Seorang salik sejati tidak puas berhenti pada pencapaian spiritual manapun.
      2. Setiap kali tersingkap suatu maqam, suara batin menyeru: tujuanmu masih lebih jauh di depan.
      3. Keindahan alam dan makhluk adalah ujian — jangan terpesona dan berhenti di sana.
      4. Alam menyeru: kami hanya perantara, jangan jadikan kami tujuan akhir.
      5. Pesan utama: perjalanan menuju Allah tidak memiliki titik akhir selama di dunia ini.`,
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 20 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/19U48OUMx1yx7WEUenujm0bU7eH1gRI_n/view?usp=drive_link'
      }
    },
    {
      id: 'h-021', babId: babTawakkal.id, num: 21,
      title: 'Hikam 21 — Hakikat Meminta kepada Allah',
      arabic: 'طَلَبُكَ مِنْهُ اتِّهَامٌ لَهُ، وَطَلَبُكَ لِغَيْرِهِ لِقِلَّةِ الْحَيَاءِ مِنْهُ، وَطَلَبُكَ مِنْ غَيْرِهِ لِوُجُودِ بُعْدِكَ عَنْهُ',
      terjemahan: '"Permintaanmu kepada-Nya (seolah Dia tidak tahu) merupakan suatu tuduhan terhadap-Nya. Permintaanmu untuk selain-Nya menunjukkan kurangnya rasa malu kepada-Nya. Dan permintaanmu dari selain-Nya disebabkan jauhnya dirimu dari-Nya."',
      penjelasan: `1. Meminta kepada Allah bukan karena Dia tidak tahu, melainkan sebagai pengakuan kebutuhan dan penghambaan.
      2. Meminta agar sesuatu berlaku pada selain Allah seolah menjadikan makhluk sebagai tujuan.
      3. Meminta dari selain Allah adalah tanda hati yang masih jauh dari-Nya.
      4. Doa yang sempurna adalah doa yang lahir dari kesadaran total bahwa hanya Allah yang memberi.
      5. Pesan utama: sempurnakan adab dalam berdoa — kenali kepada siapa dan mengapa engkau meminta.`,
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 21 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/19U48OUMx1yx7WEUenujm0bU7eH1gRI_n/view?usp=drive_link'
      }
    },
    {
      id: 'h-022', babId: babTawakkal.id, num: 22,
      title: 'Hikam 22 — Setiap Nafas Ada Takdir Allah',
      arabic: 'مَا مِنْ نَفَسٍ تُبْدِيهِ إِلَّا وَلَهُ قَدَرٌ فِيكَ يُمْضِيهِ',
      terjemahan: '"Tiada suatu nafas pun yang berhembus darimu, melainkan di situ ada takdir Allah yang berlaku padamu."',
      penjelasan: `1. Setiap hembusan nafas adalah momen takdir Allah yang sedang berjalan.
      2. Tidak ada satupun detik kehidupan yang luput dari pengaturan-Nya.
      3. Kesadaran ini mendorong manusia untuk hadir sepenuhnya bersama Allah di setiap saat.
      4. Muraqabah dimulai dari menyadari bahwa setiap nafas diketahui dan diatur oleh-Nya.
      5. Pesan utama: hidup dengan penuh kesadaran — setiap nafas adalah amanah dan takdir dari-Nya.`,
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 22 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/19U48OUMx1yx7WEUenujm0bU7eH1gRI_n/view?usp=drive_link'
      }
    },
    {
      id: 'h-023', babId: babHati.id, num: 23,
      title: 'Hikam 23 — Jangan Tunggu Bebas dari Kesibukan Dunia',
      arabic: 'لَا تَتَرَقَّبْ فُرُوغَ الْأَغْيَارِ، فَإِنَّ ذَلِكَ يَقْطَعُكَ عَنْ وُجُودِ الْمُرَاقَبَةِ لَهُ فِيمَا هُوَ مُقِيمُكَ فِيهِ',
      terjemahan: '"Jangan menunggu hingga selesai semua gangguan makhluk, sebab yang demikian itu akan menghalangimu dari muraqabah kepada-Nya, padahal Dia menempatkanmu di sana."',
      penjelasan: `1. Menunggu bebas dari kesibukan dunia sebelum bermuraqabah adalah sikap yang keliru.
      2. Allah menempatkan kita di tengah kesibukan itu justru sebagai arena muraqabah.
      3. Muraqabah bukan hanya untuk saat sunyi — ia harus hadir di setiap kondisi.
      4. Menunda kesadaran bersama Allah karena menunggu kondisi ideal adalah tipu daya nafsu.
      5. Pesan utama: hadirkan hati bersama Allah justru di tengah-tengah kesibukan, bukan sesudahnya.`,
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 23 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/19U48OUMx1yx7WEUenujm0bU7eH1gRI_n/view?usp=drive_link'
      }
    },
    {
      id: 'h-024', babId: babSyukur.id, num: 24,
      title: 'Hikam 24 — Jangan Heran dengan Kesulitan Dunia',
      arabic: 'لَا تَسْتَغْرِبْ وُقُوعَ الْأَكْدَارِ مَا دُمْتَ فِي هَذِهِ الدَّارِ، فَإِنَّهَا مَا أَبْرَزَتْ إِلَّا مَا هُوَ مُسْتَحِقُّ وَصْفِهَا وَوَاجِبُ نَعْتِهَا',
      terjemahan: '"Janganlah engkau merasa heran atas terjadinya berbagai kesulitan selama engkau berada di dunia ini, sebab memang begitulah yang patut terjadi dan yang menjadi karakter asli dunia."',
      penjelasan: `1. Dunia memang dirancang mengandung kesulitan, kepedihan, dan kekecewaan.
      2. Terkejut dengan kesulitan dunia seperti terkejut karena laut itu asin.
      3. Mengeluh atas kesulitan dunia berarti belum memahami hakikat dunia itu sendiri.
      4. Menerima watak dunia dengan lapang dada adalah bagian dari iman dan syukur.
      5. Pesan utama: kenali dunia sebagaimana adanya agar hati tidak mudah goyah oleh ujiannya.`,
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 24 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/19U48OUMx1yx7WEUenujm0bU7eH1gRI_n/view?usp=drive_link'
      }
    },
    {
      id: 'h-025', babId: babTawakkal.id, num: 25,
      title: 'Hikam 25 — Bergantung pada Allah vs Diri Sendiri',
      arabic: 'مَا تَوَقَّفَ مَطْلَبٌ أَنْتَ طَالِبُهُ بِرَبِّكَ، وَلَا تَيَسَّرَ مَطْلَبٌ أَنْتَ طَالِبُهُ بِنَفْسِكَ',
      terjemahan: '"Permintaan tidak akan terhambat selama engkau memohonnya melalui Allah. Namun, permintaan tidak akan mudah apabila engkau bergantung pada dirimu sendiri."',
      penjelasan: `1. Kunci terkabulnya hajat adalah menyandarkan diri sepenuhnya kepada Allah, bukan pada ikhtiar semata.
      2. Ikhtiar tetap wajib, namun hati tidak boleh bergantung pada ikhtiar itu.
      3. Orang yang bergantung pada dirinya sendiri akan menemukan jalan terasa berat dan tertutup.
      4. Orang yang bertawakkal kepada Allah akan menemukan kemudahan dari arah yang tidak disangka.
      5. Pesan utama: perbedaan antara berhasil dan gagal sering terletak pada kepada siapa hati bergantung.`,
      referensi: {
        label: 'Klik untuk detail Syarah Hikam 25 — Pak Ali Abdul Khalik',
        url: 'https://drive.google.com/file/d/19U48OUMx1yx7WEUenujm0bU7eH1gRI_n/view?usp=drive_link'
      }
    },
   
    /// {
    //   id: 'h-026', babId: babNiat.id, num: 26,
    //   title: 'Hikam 26 — Tawadu dalam Niat',
    //   arabic: 'مَا اسْتُودِعَ فِي غَيْبِ الطَّوِيَّاتِ ظَهَرَ فِي شَهَادَةِ السَّمَوَاتِ',
    //   terjemahan: 'Apa yang tersimpan dalam rahasia niat akan tampak nyata dalam kesaksian alam semesta.',
    //   penjelasan: 'Niat tersembunyi di dalam hati, namun Allah akan menampakkan buahnya di dunia nyata. Seseorang yang menyimpan niat ikhlas di hatinya akan tampak keindahannya dalam perilaku dan kehidupannya. Demikian pula niat yang kotor — cepat atau lambat ia akan terwujud dalam tindakan.'
    // },

    // // ── BAB 5: HATI & CAHAYA ──
    // {
    //   id: 'h-027', babId: babHati.id, num: 27,
    //   title: 'Hikam 27 — Hati yang Hidup',
    //   arabic: 'الْقَلْبُ الْمَيِّتُ لَا يَتَأَلَّمُ بِجُرُوحِ الذُّنُوبِ',
    //   terjemahan: 'Hati yang mati tidak merasakan sakit dari luka-luka dosa.',
    //   penjelasan: 'Salah satu tanda hati yang masih hidup adalah rasa sakit dan penyesalan ketika berbuat dosa. Hati yang telah mati — tertutup oleh kemaksiatan yang terus-menerus — tidak lagi merasakan kepedihan itu. Maka rasa sesal setelah berbuat dosa adalah tanda keimanan, bukan kelemahan.'
    // },
    // {
    //   id: 'h-028', babId: babHati.id, num: 28,
    //   title: 'Hikam 28 — Cahaya Bashirah',
    //   arabic: 'نُورُ الْبَصِيرَةِ مَا يَكْشِفُ عَنْ حَقِيقَةِ الدُّنْيَا وَمَا فِيهَا',
    //   terjemahan: 'Cahaya bashirah (penglihatan batin) adalah cahaya yang menyingkap hakikat dunia dan isinya.',
    //   penjelasan: 'Bashirah adalah mata hati yang melihat apa yang tidak dapat dilihat oleh mata lahir. Dengan bashirah, seseorang melihat dunia sebagaimana adanya — sementara, fana, dan penuh tipuan. Cahaya ini adalah anugerah Allah kepada hamba yang bersungguh-sungguh membersihkan hatinya.'
    // },
    // {
    //   id: 'h-029', babId: babHati.id, num: 29,
    //   title: 'Hikam 29 — Kelembutan Allah',
    //   arabic: 'مَنْ أَشْرَقَتْ بِدَايَتُهُ أَشْرَقَتْ نِهَايَتُهُ',
    //   terjemahan: 'Barangsiapa yang awalnya bersinar (dengan hidayah), maka akhirnya pun akan bersinar.',
    //   penjelasan: 'Permulaan yang baik — diawali dengan niat ikhlas, langkah yang benar, dan petunjuk Allah — adalah pertanda baik untuk akhir yang baik pula. Maka sangat penting untuk memperhatikan fondasi dan permulaan setiap amal. Pemula yang ikhlas lebih berpeluang sampai ke tujuan daripada yang berlari dengan niat yang salah.'
    // },
    // {
    //   id: 'h-030', babId: babHati.id, num: 30,
    //   title: 'Hikam 30 — Musibah yang Membuka Hati',
    //   arabic: 'رُبَّمَا أَعْطَاكَ فَمَنَعَكَ وَرُبَّمَا مَنَعَكَ فَأَعْطَاكَ',
    //   terjemahan: 'Terkadang Allah memberimu (sesuatu yang tampak seperti pemberian) namun sebenarnya Dia menghalangimu. Dan terkadang Dia menghalangimu (dari sesuatu) namun sebenarnya Dia memberimu.',
    //   penjelasan: 'Pemberian yang membuat seseorang lalai dari Allah sejatinya adalah penghalang dari kebaikan. Sebaliknya, terhalang dari sesuatu yang dicintai namun hal itu membuka jalan menuju Allah adalah pemberian yang sesungguhnya. Pandangan kita terhadap takdir seringkali terbalik dari hakikatnya.'
    // },
    // {
    //   id: 'h-031', babId: babHati.id, num: 31,
    //   title: 'Hikam 31 — Bersama Allah',
    //   arabic: 'لَا تَطْلُبْ مَنْزِلَةً وَلَكِنِ اطْلُبِ الرَّفِيقَ وَالدَّلِيلَ فَإِذَا وَجَدْتَ الرَّفِيقَ كَانَتِ الْمَنَازِلُ تَبَعًا',
    //   terjemahan: 'Janganlah mencari kedudukan (spiritual), tetapi carilah teman perjalanan dan petunjuk jalan. Jika kamu telah menemukan teman perjalanan itu, maka kedudukan akan mengikutinya sendiri.',
    //   penjelasan: 'Kesalahan banyak penempuh jalan spiritual adalah terlalu fokus pada pencapaian kedudukan dan maqam. Yang sesungguhnya dicari adalah kebersamaan dengan Allah dan para pembimbing yang sahih. Ketika keduanya ditemukan, maqam-maqam spiritual akan hadir dengan sendirinya.'
    // },
    // {
    //   id: 'h-032', babId: babHati.id, num: 32,
    //   title: 'Hikam 32 — Doa Orang yang Lalai',
    //   arabic: 'الدُّعَاءُ مِفْتَاحُ الْخَيْرِ وَالدُّعَاءُ سِلَاحُ الْمُؤْمِنِ',
    //   terjemahan: 'Doa adalah kunci segala kebaikan dan senjata orang beriman.',
    //   penjelasan: 'Doa bukan sekadar ritual, melainkan senjata yang nyata di tangan orang yang beriman. Doa membuka pintu-pintu yang terkunci, mengubah takdir yang telah tersusun, dan mendekatkan hamba kepada Tuhannya. Orang yang meninggalkan doa sesungguhnya telah melepaskan senjatanya di medan peperangan.'
    // },

    // // ── BAB 6: SYUKUR & SABAR ──
    // {
    //   id: 'h-033', babId: babSyukur.id, num: 33,
    //   title: 'Hikam 33 — Nikmat Terbesar',
    //   arabic: 'مِنْ أَعْظَمِ النِّعَمِ عَلَيْكَ أَنْ أَقَامَكَ فِي الظَّاهِرِ عَلَى الْخِدْمَةِ وَأَدَّبَكَ فِي الْبَاطِنِ عَلَى الرُّبُوبِيَّةِ',
    //   terjemahan: 'Di antara nikmat terbesar atasmu adalah bahwa Allah menugaskanmu secara lahir dalam ibadah dan mendidikmu secara batin dengan penghayatan rububiyah-Nya.',
    //   penjelasan: 'Nikmat terbesar bukan harta atau kesehatan, melainkan ditempatkannya seseorang dalam barisan ahli ibadah, dan lebih dari itu, dianugerahkannya penghayatan batin bahwa seluruh ibadah hanya untuk Allah. Orang yang mencapai ini telah meraih dua nikmat sekaligus: ibadah lahir yang istiqamah dan hati yang hadir.'
    // },
    // {
    //   id: 'h-034', babId: babSyukur.id, num: 34,
    //   title: 'Hikam 34 — Kesabaran yang Indah',
    //   arabic: 'الصَّبْرُ عَلَى الطَّاعَةِ أَشَقُّ مِنَ الصَّبْرِ عَنِ الْمَعْصِيَةِ وَالصَّبْرُ عَلَى الْبَلَاءِ أَيْسَرُ مِنَ الصَّبْرِ عَلَى الطَّاعَةِ',
    //   terjemahan: 'Sabar dalam ketaatan lebih berat daripada sabar dari kemaksiatan. Dan sabar dalam menghadapi musibah lebih mudah dari sabar dalam ketaatan.',
    //   penjelasan: 'Ada tiga tingkat kesabaran. Paling mudah adalah sabar menghadapi musibah — karena jiwa terdorong oleh naluri. Lebih berat adalah sabar menahan diri dari kemaksiatan. Yang paling berat adalah sabar dalam menjalankan ketaatan secara terus-menerus dengan penuh kehadiran hati. Inilah puncak kesabaran.'
    // },
    // {
    //   id: 'h-035', babId: babSyukur.id, num: 35,
    //   title: 'Hikam 35 — Syukur atas Musibah',
    //   arabic: 'الْبَلَاءُ مِنَ الْوَلِيِّ كَرَامَةٌ وَمِنَ الْعَدُوِّ عُقُوبَةٌ',
    //   terjemahan: 'Musibah dari sisi Wali (kekasih Allah) adalah kemuliaan, sedangkan dari sisi musuh adalah hukuman.',
    //   penjelasan: 'Musibah yang sama dapat memiliki makna yang berbeda tergantung kepada siapa yang mengalaminya. Bagi kekasih Allah, musibah adalah ujian yang memuliakan, pemurni yang membersihkan, dan tangga yang meninggikan derajat. Bagi orang yang jauh dari Allah, musibah adalah hukuman dan peringatan untuk kembali.'
    // },
    // {
    //   id: 'h-036', babId: babSyukur.id, num: 36,
    //   title: 'Hikam 36 — Syukur yang Menambah Nikmat',
    //   arabic: 'الشُّكْرُ قَيْدُ النِّعَمِ الْمَوْجُودَةِ وَصَيْدُ النِّعَمِ الْمَفْقُودَةِ',
    //   terjemahan: 'Syukur adalah tali yang mengikat nikmat yang sudah ada dan jaring yang menangkap nikmat yang belum ada.',
    //   penjelasan: 'Syukur memiliki dua fungsi sekaligus: menjaga nikmat yang telah dimiliki agar tidak pergi, sekaligus menarik nikmat-nikmat baru yang belum datang. Allah berfirman bahwa jika bersyukur, niscaya Dia akan menambah nikmat. Maka syukur adalah investasi terbaik dalam kehidupan seorang mukmin.'
    // },
    // {
    //   id: 'h-037', babId: babSyukur.id, num: 37,
    //   title: 'Hikam 37 — Bersyukur atas Kekurangan',
    //   arabic: 'إِيَّاكَ أَنْ تَنْظُرَ إِلَى صِغَرِ الذَّنْبِ وَلَكِنِ انْظُرْ إِلَى عَظَمَةِ مَنْ عَصَيْتَهُ',
    //   terjemahan: 'Waspadalah terhadap memandang kecilnya dosa, tetapi lihatlah kepada kebesaran Dzat yang kamu durhakai.',
    //   penjelasan: 'Tidak ada dosa yang kecil jika dilihat dari siapa yang didurhakai. Allah adalah Dzat Yang Mahaagung, maka mendurhakai-Nya adalah perkara yang sangat besar, apapun wujud kedurhakaan itu. Kesadaran ini akan menumbuhkan taubat yang sungguh-sungguh dari setiap perbuatan dosa, besar maupun kecil.'
    // },
    // {
    //   id: 'h-038', babId: babSyukur.id, num: 38,
    //   title: 'Hikam 38 — Makna di Balik Ujian',
    //   arabic: 'مَا أَوْجَدَكَ فِي الْكَوْنِ إِلَّا لِيَشْهَدَ فِيكَ الصِّفَاتِ وَيُظْهِرَ فِيكَ الْآيَاتِ',
    //   terjemahan: 'Allah tidak menciptakanmu di alam ini melainkan agar Dia menyaksikan sifat-sifat-Nya pada dirimu dan menampakkan ayat-ayat-Nya melaluimu.',
    //   penjelasan: 'Manusia adalah manifestasi dari nama dan sifat-sifat Allah. Setiap pribadi adalah cermin yang memantulkan keindahan-Nya dengan cara yang unik. Ujian, karunia, dan seluruh perjalanan hidup adalah media untuk menghadirkan penampakan sifat-sifat ilahi, baik Rahman, Rahim, Jabbar, maupun Lathif.'
    // },

    // // ── BAB 7: TAUBAT & HARAPAN ──
    // {
    //   id: 'h-039', babId: babTaubat.id, num: 39,
    //   title: 'Hikam 39 — Pintu Taubat',
    //   arabic: 'مَا تَرَكَ الذَّنْبَ خَوْفًا مِنَ اللهِ إِلَّا صَادِقٌ وَلَا تَابَ حُبًّا لِلَّهِ إِلَّا عَارِفٌ',
    //   terjemahan: 'Tidaklah meninggalkan dosa karena takut kepada Allah kecuali orang yang jujur. Dan tidaklah bertaubat karena cinta kepada Allah kecuali orang yang arif.',
    //   penjelasan: 'Ada dua motivasi meninggalkan dosa yang bernilai tinggi. Yang pertama dan lebih umum adalah rasa takut kepada Allah — ini tanda kejujuran iman. Yang kedua dan lebih tinggi adalah rasa cinta kepada Allah — meninggalkan dosa karena tidak ingin mengecewakan yang dicintai. Inilah taubatnya para arifin.'
    // },
    // {
    //   id: 'h-040', babId: babTaubat.id, num: 40,
    //   title: 'Hikam 40 — Harapan kepada Allah',
    //   arabic: 'لَوْلَا مَيَادِينُ النُّفُوسِ مَا تَحَقَّقَتِ الدَّعَاوَى لِلسَّالِكِينَ',
    //   terjemahan: 'Seandainya tidak ada medan-medan nafsu, tidak akan terbukti pengakuan-pengakuan para pejalan spiritual.',
    //   penjelasan: 'Nafsu dan godaan bukan semata hambatan, melainkan juga arena pembuktian. Tanpa adanya nafsu yang harus dilawan, pengakuan seseorang telah mencapai maqam tertentu tidak akan pernah teruji. Allah memberikan nafsu bukan untuk menghancurkan hamba, tetapi untuk membuktikan dan meninggikan derajat mereka yang berhasil mengatasinya.'
    // },
    // {
    //   id: 'h-041', babId: babTaubat.id, num: 41,
    //   title: 'Hikam 41 — Taubat yang Diterima',
    //   arabic: 'إِذَا أَرَدْتَ أَنْ تَعْلَمَ قَدْرَكَ عِنْدَهُ فَانْظُرْ فِيمَا يُقِيمُكَ',
    //   terjemahan: 'Jika kamu ingin mengetahui kedudukanmu di sisi Allah, maka lihatlah dalam hal apa Allah mendudukkanmu.',
    //   penjelasan: 'Kondisi yang Allah tempatkan pada diri seseorang — apakah dalam ketaatan atau kelalaian, dalam ilmu atau kebodohan, dalam kemudahan atau kesulitan — adalah cerminan kedudukan seseorang di sisi-Nya saat itu. Ini bukan untuk memupuk rasa puas diri, melainkan untuk muhasabah dan terus meningkatkan kualitas diri.'
    // },
    // {
    //   id: 'h-042', babId: babTaubat.id, num: 42,
    //   title: 'Hikam 42 — Dosa yang Membawa Kebaikan',
    //   arabic: 'رُبَّمَا كَانَتِ الْمَعْصِيَةُ أَنْفَعَ لَكَ مِنَ الطَّاعَةِ إِذَا أَوْرَثَتْكَ ذُلًّا وَانْكِسَارًا',
    //   terjemahan: 'Terkadang sebuah kemaksiatan lebih bermanfaat bagimu daripada ketaatan, apabila kemaksiatan itu mewariskan kehinaan dan kepecahan hati (yang mendorong taubat).',
    //   penjelasan: 'Ini bukan pembenaran untuk bermaksiat, melainkan penghiburan bagi yang terjatuh. Terkadang seseorang jatuh dalam dosa lalu merasakan kepedihan mendalam, dan kepedihan itu mendorongnya bertaubat dan kembali kepada Allah dengan lebih sungguh-sungguh dari sebelumnya. Ini lebih baik daripada ketaatan yang membuatnya sombong.'
    // },
    // {
    //   id: 'h-043', babId: babTaubat.id, num: 43,
    //   title: 'Hikam 43 — Kembali kepada Allah',
    //   arabic: 'إِيَّاكَ أَنْ تُؤَخِّرَ التَّوْبَةَ لِاسْتِكْمَالِ الشَّهَوَاتِ فَإِنَّ ذَلِكَ مِنْ أَعْظَمِ خُدَعِ الشَّيْطَانِ',
    //   terjemahan: 'Waspadalah terhadap menunda taubat karena ingin menghabiskan syahwat terlebih dahulu, karena itu termasuk tipu daya setan yang paling besar.',
    //   penjelasan: 'Setan menggoda manusia untuk terus menunda taubat dengan berkata "taubatlah nanti setelah ini." Namun tidak ada seorangpun yang tahu kapan kematiannya tiba. Menunda taubat adalah salah satu jebakan setan yang paling berbahaya karena terasa masuk akal namun mengandung risiko yang sangat besar.'
    // },

    // // ── BAB 8: RAHMAT & UJIAN ──
    // {
    //   id: 'h-044', babId: babRahmat.id, num: 44,
    //   title: 'Hikam 44 — Rahmat Allah yang Luas',
    //   arabic: 'مَا وَسِعَتِ الْأَرْضُ وَالسَّمَاءُ رَحْمَتَهُ وَوَسِعَهَا قَلْبُ عَبْدِهِ الْمُؤْمِنِ',
    //   terjemahan: 'Bumi dan langit tidak mampu menampung rahmat-Nya, namun rahmat itu tertampung dalam hati hamba-Nya yang beriman.',
    //   penjelasan: 'Hati seorang mukmin memiliki kapasitas rohani yang melampaui kapasitas fisik alam semesta. Bumi dan langit hanya mampu menampung ciptaan yang bersifat fisik, sedangkan hati mampu menampung cahaya, kasih sayang, dan rahmat ilahi yang bersifat transenden. Inilah keagungan manusia yang beriman.'
    // },
    // {
    //   id: 'h-045', babId: babRahmat.id, num: 45,
    //   title: 'Hikam 45 — Ujian sebagai Kemurahan',
    //   arabic: 'مَا أَنْزَلَ اللهُ بَلَاءً إِلَّا وَفِيهِ نِعْمَةٌ خَفِيَّةٌ وَمَا رَفَعَ نِعْمَةً إِلَّا وَفِيهَا بَلَاءٌ مُضْمَرٌ',
    //   terjemahan: 'Allah tidak menurunkan musibah melainkan di dalamnya terdapat nikmat tersembunyi. Dan Allah tidak mengangkat nikmat melainkan di dalamnya terdapat musibah yang tersimpan.',
    //   penjelasan: 'Realitas kehidupan tidak sesederhana yang tampak. Setiap musibah mengandung nikmat tersembunyi — pelajaran, pemurnian, kenaikan derajat, atau pendekatan kepada Allah. Sebaliknya, setiap nikmat menyimpan ujian tersembunyi — godaan, kelalaian, atau ketergantungan kepada selain Allah. Maka bijaksanalah dalam menyikapi keduanya.'
    // },
    // {
    //   id: 'h-046', babId: babRahmat.id, num: 46,
    //   title: 'Hikam 46 — Pandangan Allah kepada Hamba',
    //   arabic: 'حُسْنُ ظَنِّكَ بِاللهِ هُوَ الَّذِي يُطَيِّبُ قَلْبَكَ فَكَيْفَ تَطِيبُ رُوحُكَ وَأَنْتَ لَا تُحْسِنُ الظَّنَّ بِرَبِّكَ',
    //   terjemahan: 'Prasangka baikmu kepada Allah adalah yang membuat hatimu menjadi baik. Maka bagaimana mungkin jiwamu menjadi baik sementara kamu tidak berprasangka baik kepada Tuhanmu.',
    //   penjelasan: 'Husnuzhon kepada Allah adalah fondasi ketenangan jiwa. Ketika seseorang percaya bahwa Allah Maha Baik dan selalu menghendaki kebaikan bagi hamba-Nya, hati menjadi tentram bahkan di tengah ujian terberat. Sebaliknya, suuzhon kepada Allah adalah sumber kegelisahan yang tiada habisnya.'
    // },
    // {
    //   id: 'h-047', babId: babRahmat.id, num: 47,
    //   title: 'Hikam 47 — Keajaiban Orang yang Kafir Nikmat',
    //   arabic: 'عَجِبْتُ لِمَنْ يَطْلُبُ شَيْئًا وَقَدْ وُجِدَ فِيهِ ذَلِكَ الشَّيْءُ',
    //   terjemahan: 'Aku heran kepada orang yang mencari sesuatu padahal di dalam dirinya sudah terdapat sesuatu itu.',
    //   penjelasan: 'Banyak manusia mencari kebahagiaan, kedamaian, dan makna hidup di luar dirinya, padahal semua itu telah Allah titipkan di dalam fitrahnya. Manusia mencari cahaya di luar padahal cahaya itu ada di dalam hatinya. Pencarian yang benar adalah perjalanan ke dalam diri, bukan pelarian keluar.'
    // },
    // {
    //   id: 'h-048', babId: babRahmat.id, num: 48,
    //   title: 'Hikam 48 — Kasih Sayang dalam Setiap Takdir',
    //   arabic: 'لَا تَعْجَبْ مِنْ وُقُوعِ الْأَحْزَانِ مَا دُمْتَ فِي دَارِ الدُّنْيَا فَإِنَّهَا لَا تُظْهِرُ إِلَّا مَا هُوَ مُقْتَضَى وَصْفِهَا وَطَبِيعَةُ أَرْضِهَا',
    //   terjemahan: 'Janganlah heran dengan datangnya kesedihan selama kamu masih berada di dunia, karena dunia hanya menampakkan apa yang merupakan tuntutan sifatnya dan tabiat dasarnya.',
    //   penjelasan: 'Dunia adalah tempat persinggahan yang memang tidak dirancang untuk kesempurnaan dan kesenangan abadi. Kesedihan, kesulitan, dan kelelahan adalah bagian dari karakter dunia. Mengeluh terhadap ini seperti mengeluh karena laut itu asin. Yang bijaksana adalah menerima sifat dunia dan menyiapkan diri untuk kehidupan yang kekal.'
    // },
    // {
    //   id: 'h-049', babId: babRahmat.id, num: 49,
    //   title: 'Hikam 49 — Tanda Cinta yang Benar',
    //   arabic: 'مَنْ أَحَبَّكَ نَهَاكَ وَمَنْ أَرَادَ الدُّنْيَا مِنْكَ مَدَحَكَ',
    //   terjemahan: 'Orang yang mencintaimu akan melarangmu (dari yang buruk), sedangkan orang yang menginginkan dunia darimu akan memujimu.',
    //   penjelasan: 'Cinta yang sejati terkadang tampak keras karena mencegah dari hal yang membahayakan. Sementara orang yang memuji tanpa batas seringkali bermotif kepentingan duniawi. Maka jangan terkecoh oleh pujian yang berlebihan, dan jangan salah memahami nasihat sebagai permusuhan.'
    // },
    // {
    //   id: 'h-050', babId: babRahmat.id, num: 50,
    //   title: 'Hikam 50 — Akhir Perjalanan',
    //   arabic: 'نِهَايَةُ الْعَارِفِ الِانْقِطَاعُ إِلَى اللهِ وَبِدَايَتُهُ كَذَلِكَ',
    //   terjemahan: 'Tujuan akhir seorang arif adalah memutuskan diri sepenuhnya kepada Allah, dan awalnya pun demikian.',
    //   penjelasan: 'Perjalanan rohani dimulai dan diakhiri dengan satu hal yang sama: kembali dan berserah sepenuhnya kepada Allah. Di awal perjalanan, seorang murid belajar untuk melepaskan keterikatan pada dunia dan bergantung hanya kepada Allah. Di puncak perjalanan, ia mewujudkan hal yang sama dengan lebih sempurna. Maka ujung dan awal bertemu dalam satu titik: Allah SWT.'
    // },
  ]

  for (const h of hikamList) {
    const hikamContent = {
      type: 'hikam',
      number: h.num,
      arabic: h.arabic,
      terjemahan: h.terjemahan,
      penjelasan: h.penjelasan,
      ...(h.referensi ? { referensi: h.referensi } : {})
    }
    await prisma.materi.upsert({
      where: { id: h.id },
      update: {
        babId: h.babId,
        title: h.title,
        orderNum: h.num,
        content: hikamContent,
      },
      create: {
        id: h.id, babId: h.babId, title: h.title, orderNum: h.num,
        content: hikamContent,
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