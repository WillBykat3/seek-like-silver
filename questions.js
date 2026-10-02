// Seek Like Silver — question bank
//
// Each question has:
//   id          – permanent ID (never reuse or change one; saved answers point to it)
//   num         – the question's public number (3 digits, random, unique, never reused);
//                 shown in a bubble, used in links (#q=482) and printouts
//   prompt      – the question itself, with no verse references in it
//   passage     – "In question": the Scripture the question is about
//   inspiration – "Inspiration": other Scripture that helps you answer
//   readings    – "Look up": theologians, each pointed to a SPECIFIC work, never a paraphrased quote
//   fathers     – "What the early church fathers said": exact passages (to about AD 750), each
//                 opened and checked; `about` says what the passage deals with, never a made-up quote
//   topics      – keys from TOPICS below, for browsing
// Scripture is given as references only (no translation copyright issues). Keep each
// reference inside one chapter ("Romans 1:18-32", not "Romans 1:18-2:16") so verse
// links and previews work.
//
// Levels:
//   beginner    – What does this passage say?
//   moderate    – How does this fit with the rest of Scripture?
//   philosopher – Where do Christians wrestle or disagree, and what's at stake?
//
// Add new questions at the end of a level's list with the next ID (b31, m31, p31, ...).
// Every book in `readings` must also be in library.js.

const TOPICS = {
  god:       { label: "God & the Trinity",         desc: "Who God is: one God in three persons, eternal and unchanging." },
  christ:    { label: "Jesus Christ",              desc: "The Word made flesh: who Jesus is and what he came to do." },
  spirit:    { label: "The Holy Spirit",           desc: "The Spirit's person and work in believers and the church." },
  creation:  { label: "Creation & humanity",       desc: "The world God made, and what it means to be human." },
  sin:       { label: "Sin, evil & suffering",     desc: "The fall, the problem of evil, and why the righteous suffer." },
  salvation: { label: "Salvation & grace",         desc: "How God rescues sinners and makes them his own." },
  covenant:  { label: "Covenant & Israel",         desc: "God's promises to Abraham, Moses, and David, and the new covenant." },
  scripture: { label: "Scripture & knowing God",   desc: "How God makes himself known, and how we read the Bible." },
  church:    { label: "Church & sacraments",       desc: "The body of Christ, baptism, and the Lord's Supper." },
  life:      { label: "Prayer & Christian living", desc: "Prayer, holiness, love, and following Jesus day to day." },
  hope:      { label: "Death, resurrection & hope", desc: "Christ's return, the resurrection, and the new creation." }
};

const QUESTIONS = {
  beginner: [
    {
      id: "b1",
      num: 424,
      prompt: "John's Gospel opens by calling Jesus \"the Word.\" Who is the Word, and what does it mean that the Word \"became flesh\"?",
      passage: ["John 1:1-14"],
      inspiration: ["Philippians 2:5-8", "Colossians 1:15-20", "Hebrews 1:1-3"],
      readings: [
        { who: "Athanasius", work: "On the Incarnation" },
        { who: "C.S. Lewis", work: "Mere Christianity, Book 4" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homily 11 on the Gospel of John", where: "on John 1:14", url: "https://www.newadvent.org/fathers/240111.htm", about: "Homily on \"the Word was made flesh, and dwelt among us\"" },
        { who: "Augustine", work: "Tractate 1 on the Gospel of John", where: "on John 1:1–5", url: "https://www.newadvent.org/fathers/1701001.htm", about: "The eternal Word through whom all things were made" }
      ],
      topics: ["christ"]
    },
    {
      id: "b2",
      num: 314,
      prompt: "What does it mean for human beings to be made in the image of God?",
      passage: ["Genesis 1:26-28"],
      inspiration: ["Genesis 9:6", "Psalm 8:3-8", "James 3:9", "Colossians 3:10"],
      readings: [
        { who: "Irenaeus of Lyons", work: "Against Heresies, Book 5" },
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 1, ch. 15" }
      ],
      fathers: [
        { who: "Gregory of Nyssa", work: "On the Making of Man", where: "ch. 5", url: "https://www.newadvent.org/fathers/2914.htm", about: "How human nature is a likeness of God" },
        { who: "Athanasius", work: "On the Incarnation", where: "chs. 11–14", url: "https://www.newadvent.org/fathers/2802.htm", about: "Why only the Word could renew God's image in humanity" }
      ],
      topics: ["creation"]
    },
    {
      id: "b3",
      num: 610,
      prompt: "In the parable of the prodigal son, what does the father's response to his returning son teach about God?",
      passage: ["Luke 15:11-32"],
      inspiration: ["Psalm 103:8-13", "Romans 5:8", "Luke 15:1-7"],
      readings: [
        { who: "Henri Nouwen", work: "The Return of the Prodigal Son" },
        { who: "Timothy Keller", work: "The Prodigal God" }
      ],
      fathers: [
        { who: "Jerome", work: "Letter 21 (to Pope Damasus)", where: "", url: "https://www.newadvent.org/fathers/3001021.htm", about: "Detailed explanation of the parable of the prodigal son" },
        { who: "Cyril of Alexandria", work: "Commentary on Luke", where: "Sermon 107 (Luke 15:11–32)", url: "https://www.tertullian.org/fathers/cyril_on_luke_10_sermons_99_109.htm", about: "Sermon on the parable of the prodigal son" },
        { who: "Tertullian", work: "On Repentance", where: "ch. 8", url: "https://www.newadvent.org/fathers/0320.htm", about: "The prodigal's father as a picture of God receiving penitents" }
      ],
      topics: ["salvation", "god"]
    },
    {
      id: "b4",
      num: 640,
      prompt: "In the parable of the Good Samaritan, Jesus answers the question \"Who is my neighbor?\" What is his answer, and what does it ask of us?",
      passage: ["Luke 10:25-37"],
      inspiration: ["Leviticus 19:18", "Leviticus 19:33-34", "1 John 4:19-21"],
      readings: [
        { who: "Augustine", work: "On Christian Doctrine, Book 1" },
        { who: "Dietrich Bonhoeffer", work: "Life Together" }
      ],
      fathers: [
        { who: "Cyril of Alexandria", work: "Commentary on Luke", where: "Sermon 68 (Luke 10:25–37)", url: "https://www.tertullian.org/fathers/cyril_on_luke_07_sermons_66_80.htm", about: "Sermon on the lawyer's question and the Good Samaritan" },
        { who: "Clement of Alexandria", work: "Who Is the Rich Man That Shall Be Saved?", where: "chs. 28–29", url: "https://www.newadvent.org/fathers/0207.htm", about: "The two great commandments and \"Who is my neighbor?\"" }
      ],
      topics: ["life"]
    },
    {
      id: "b5",
      num: 560,
      prompt: "How is a person saved, and where do good works fit in?",
      passage: ["Ephesians 2:8-10"],
      inspiration: ["Titus 3:4-7", "Romans 3:23-24", "James 2:14-26"],
      readings: [
        { who: "Martin Luther", work: "The Freedom of a Christian" },
        { who: "Augustine", work: "On the Spirit and the Letter" }
      ],
      fathers: [
        { who: "Clement of Rome", work: "First Epistle to the Corinthians (1 Clement)", where: "chs. 32–33", url: "https://www.newadvent.org/fathers/1010.htm", about: "Justified by faith, not our own works; yet keep doing good works" },
        { who: "John Chrysostom", work: "Homily 4 on Ephesians", where: "on Eph. 2:1–10", url: "https://www.newadvent.org/fathers/230104.htm", about: "Homily on \"by grace you have been saved through faith\"" }
      ],
      topics: ["salvation"]
    },
    {
      id: "b6",
      num: 425,
      prompt: "What does the Lord's Prayer teach us about what prayer is and what we should pray for?",
      passage: ["Matthew 6:5-13"],
      inspiration: ["Luke 11:1-13", "Philippians 4:6-7", "Romans 8:26"],
      readings: [
        { who: "Cyprian of Carthage", work: "On the Lord's Prayer" },
        { who: "Martin Luther", work: "A Simple Way to Pray" }
      ],
      fathers: [
        { who: "Tertullian", work: "On Prayer", where: "chs. 1–9", url: "https://www.newadvent.org/fathers/0322.htm", about: "Clause-by-clause exposition of the Lord's Prayer" },
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 23 (Mystagogical Lecture 5)", where: "sections 11–18", url: "https://www.newadvent.org/fathers/310123.htm", about: "Explaining each petition of the Our Father to the newly baptized" },
        { who: "John Chrysostom", work: "Homily 19 on Matthew", where: "on Matt. 6:1–15", url: "https://www.newadvent.org/fathers/200119.htm", about: "Homily on secret prayer and the Lord's Prayer" }
      ],
      topics: ["life"]
    },
    {
      id: "b7",
      num: 883,
      prompt: "This psalm describes God as a shepherd. What does that image teach about how God cares for his people?",
      passage: ["Psalm 23"],
      inspiration: ["John 10:11-15", "Ezekiel 34:11-16", "Isaiah 40:11"],
      readings: [
        { who: "Charles Spurgeon", work: "The Treasury of David, on Psalm 23" },
        { who: "Augustine", work: "Expositions on the Psalms" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homily 60 on the Gospel of John", where: "on John 10:14–15 ff.", url: "https://www.newadvent.org/fathers/240160.htm", about: "Christ the Good Shepherd who knows his sheep and lays down his life" },
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 22 (Mystagogical Lecture 4)", where: "section 7", url: "https://www.newadvent.org/fathers/310122.htm", about: "Reads Psalm 23's prepared table as the Lord's Table" }
      ],
      topics: ["god", "life"]
    },
    {
      id: "b8",
      num: 922,
      prompt: "Why did Jesus die? What reasons do Paul's summary of the gospel and Isaiah's prophecy of the suffering servant give?",
      passage: ["1 Corinthians 15:3-8", "Isaiah 53:4-6"],
      inspiration: ["Mark 10:45", "Romans 5:6-8", "1 Peter 2:24"],
      readings: [
        { who: "Athanasius", work: "On the Incarnation" },
        { who: "John Stott", work: "The Cross of Christ" }
      ],
      fathers: [
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 13", where: "esp. sections 1–3, 34", url: "https://www.newadvent.org/fathers/310113.htm", about: "Lecture on \"crucified and buried,\" drawing on Isaiah 53" },
        { who: "John Chrysostom", work: "Homily 38 on First Corinthians", where: "on 1 Cor. 15:1–11", url: "https://www.newadvent.org/fathers/220138.htm", about: "Homily on \"Christ died for our sins according to the Scriptures\"" },
        { who: "Gregory of Nazianzus", work: "Oration 45 (Second Oration on Easter)", where: "section 22", url: "https://www.newadvent.org/fathers/310245.htm", about: "To whom was Christ's blood offered, and why was it shed?" }
      ],
      topics: ["christ", "salvation"]
    },
    {
      id: "b9",
      num: 127,
      prompt: "What does Jesus say the Holy Spirit will do for his followers?",
      passage: ["John 14:15-27", "John 16:7-15"],
      inspiration: ["Galatians 5:22-23", "Romans 8:14-16", "Acts 1:8"],
      readings: [
        { who: "Basil of Caesarea", work: "On the Holy Spirit" },
        { who: "J.I. Packer", work: "Keep in Step with the Spirit" }
      ],
      fathers: [
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 16", where: "", url: "https://www.newadvent.org/fathers/310116.htm", about: "Lecture on the Holy Spirit, the Comforter, who spoke by the prophets" },
        { who: "John Chrysostom", work: "Homily 75 on the Gospel of John", where: "on John 14:15–31", url: "https://www.newadvent.org/fathers/240175.htm", about: "Homily on Christ's promise of \"another Comforter\"" },
        { who: "John Chrysostom", work: "Homily 78 on the Gospel of John", where: "on John 16:4–15", url: "https://www.newadvent.org/fathers/240178.htm", about: "The Spirit convicting the world and guiding into all truth" }
      ],
      topics: ["spirit"]
    },
    {
      id: "b10",
      num: 715,
      prompt: "What would be lost if Jesus had not risen from the dead? What does his resurrection change?",
      passage: ["1 Corinthians 15:12-22"],
      inspiration: ["Romans 6:4-5", "1 Peter 1:3", "John 11:25-26"],
      readings: [
        { who: "N.T. Wright", work: "Surprised by Hope" },
        { who: "Athanasius", work: "On the Incarnation" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homily 39 on First Corinthians", where: "on 1 Cor. 15:11–28", url: "https://www.newadvent.org/fathers/220139.htm", about: "Homily on \"if Christ has not been raised\" and Christ the firstfruits" },
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 14", where: "", url: "https://www.newadvent.org/fathers/310114.htm", about: "Lecture on Christ's resurrection, ascension, and session at God's right hand" }
      ],
      topics: ["christ", "hope"]
    },
    {
      id: "b11",
      num: 272,
      prompt: "What does the Bible's opening account of creation teach about who God is and what kind of world he made?",
      passage: ["Genesis 1", "Genesis 2:1-3"],
      inspiration: ["Psalm 104:24-30", "Psalm 33:6-9", "John 1:1-3"],
      readings: [
        { who: "Basil of Caesarea", work: "Hexaemeron (Homilies on the Six Days of Creation)" },
        { who: "Augustine", work: "Confessions, Books 11–13" }
      ],
      fathers: [
        { who: "Theophilus of Antioch", work: "To Autolycus, Book 2", where: "chs. 10–18", url: "https://www.newadvent.org/fathers/02042.htm", about: "Walk through the six days of creation in Genesis 1" },
        { who: "Athanasius", work: "On the Incarnation", where: "chs. 2–3", url: "https://www.newadvent.org/fathers/2802.htm", about: "Creation out of nothing through the Word, against rival theories" },
        { who: "Augustine", work: "City of God, Book 11", where: "chs. 4–8", url: "https://www.newadvent.org/fathers/120111.htm", about: "The world's beginning, the creation days, and God's seventh-day rest" }
      ],
      topics: ["creation", "god"]
    },
    {
      id: "b12",
      num: 298,
      prompt: "What happened in the garden? How did the first sin change humanity's relationship with God, with each other, and with the world?",
      passage: ["Genesis 3"],
      inspiration: ["Romans 5:12", "Romans 8:20-22", "1 Corinthians 15:21-22"],
      readings: [
        { who: "Augustine", work: "City of God, Book 14" },
        { who: "C.S. Lewis", work: "The Problem of Pain, ch. 5" }
      ],
      fathers: [
        { who: "Irenaeus of Lyons", work: "Against Heresies, Book 3", where: "ch. 23", url: "https://www.newadvent.org/fathers/0103323.htm", about: "Adam's sin, the curse on the serpent, and Adam's salvation in Christ" },
        { who: "Theophilus of Antioch", work: "To Autolycus, Book 2", where: "chs. 21–26", url: "https://www.newadvent.org/fathers/02042.htm", about: "The fall, the tree of knowledge, and expulsion from paradise" },
        { who: "Athanasius", work: "On the Incarnation", where: "chs. 4–5", url: "https://www.newadvent.org/fathers/2802.htm", about: "How the transgression brought corruption and death on humanity" }
      ],
      topics: ["sin", "creation"]
    },
    {
      id: "b13",
      num: 632,
      prompt: "What do the Ten Commandments show about God and how his people should live? Why does God remind them he rescued them from Egypt before giving the commands?",
      passage: ["Exodus 20:1-17"],
      inspiration: ["Matthew 22:36-40", "Romans 13:8-10", "Psalm 19:7-11"],
      readings: [
        { who: "Martin Luther", work: "Large Catechism, Part 1 (The Ten Commandments)" },
        { who: "Reformed Churches", work: "Heidelberg Catechism, Q&A 92–115" }
      ],
      fathers: [
        { who: "Irenaeus of Lyons", work: "Against Heresies, Book 4", where: "ch. 16", url: "https://www.newadvent.org/fathers/0103416.htm", about: "The Decalogue compared with circumcision and ceremonial law" },
        { who: "Theophilus of Antioch", work: "To Autolycus, Book 3", where: "ch. 9", url: "https://www.newadvent.org/fathers/02043.htm", about: "The Christian doctrine of God and his law, citing the commandments" }
      ],
      topics: ["life", "covenant"]
    },
    {
      id: "b14",
      num: 224,
      prompt: "Jesus called loving God with all your heart, soul, and mind the greatest commandment. What does it mean to love God this way, and why is loving your neighbor \"like it\"?",
      passage: ["Matthew 22:34-40"],
      inspiration: ["Deuteronomy 6:4-9", "Leviticus 19:18", "1 John 4:7-12"],
      readings: [
        { who: "Bernard of Clairvaux", work: "On Loving God" },
        { who: "Augustine", work: "On Christian Doctrine, Book 1" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homily 71 on Matthew", where: "on Matt. 22:34–46", url: "https://www.newadvent.org/fathers/200171.htm", about: "Homily on the first and great commandment and the second like it" },
        { who: "Clement of Alexandria", work: "Who Is the Rich Man That Shall Be Saved?", where: "chs. 28–29", url: "https://www.newadvent.org/fathers/0207.htm", about: "Love of God first, then love of neighbor" }
      ],
      topics: ["life"]
    },
    {
      id: "b15",
      num: 188,
      prompt: "What kind of people does Jesus call \"blessed\" in the Beatitudes, and why might that have surprised the people listening?",
      passage: ["Matthew 5:1-12"],
      inspiration: ["Luke 6:20-26", "Isaiah 61:1-3", "Psalm 37:11"],
      readings: [
        { who: "Augustine", work: "Our Lord's Sermon on the Mount, Book 1" },
        { who: "Dietrich Bonhoeffer", work: "Discipleship (The Cost of Discipleship)" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homily 15 on Matthew", where: "on Matt. 5:1–16", url: "https://www.newadvent.org/fathers/200115.htm", about: "Homily going through the Beatitudes one by one" },
        { who: "Leo the Great", work: "Sermon 95", where: "on Matt. 5:1–9", url: "https://www.newadvent.org/fathers/360395.htm", about: "A homily on the Beatitudes" }
      ],
      topics: ["life", "christ"]
    },
    {
      id: "b16",
      num: 733,
      prompt: "Jesus tells Nicodemus that he must be \"born again\" (or \"born from above\"). What does Jesus mean, and how does it happen?",
      passage: ["John 3:1-21"],
      inspiration: ["Ezekiel 36:25-27", "2 Corinthians 5:17", "1 Peter 1:3", "Titus 3:4-7"],
      readings: [
        { who: "John Chrysostom", work: "Homilies on the Gospel of John" },
        { who: "John Wesley", work: "Sermons on Several Occasions, \"The New Birth\"" }
      ],
      fathers: [
        { who: "Augustine", work: "Tractate 11 on the Gospel of John", where: "on John 2:23–3:5", url: "https://www.newadvent.org/fathers/1701011.htm", about: "Nicodemus and being born of water and the Spirit" },
        { who: "Justin Martyr", work: "First Apology", where: "ch. 61", url: "https://www.ccel.org/ccel/schaff/anf01.viii.ii.lxi.html", about: "Early description of baptism as new birth, citing John 3" }
      ],
      topics: ["salvation", "spirit"]
    },
    {
      id: "b17",
      num: 868,
      prompt: "What is faith, according to this chapter? What do the examples of Abraham, Moses, and the others show about it?",
      passage: ["Hebrews 11"],
      inspiration: ["Genesis 15:1-6", "Genesis 22:1-18", "Romans 4:18-22"],
      readings: [
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 3, ch. 2" },
        { who: "Martin Luther", work: "Preface to the Epistle to the Romans" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homily 21 on Hebrews", where: "on Heb. 10:32–11:2", url: "https://www.newadvent.org/fathers/240221.htm", about: "Homily on faith as \"the substance of things hoped for\"" },
        { who: "Clement of Rome", work: "First Epistle to the Corinthians (1 Clement)", where: "chs. 9–12", url: "https://www.newadvent.org/fathers/1010.htm", about: "Examples of faith: Enoch, Noah, Abraham, Lot, Rahab" },
        { who: "Augustine", work: "Enchiridion (Handbook on Faith, Hope and Love)", where: "ch. 8", url: "https://www.newadvent.org/fathers/1302.htm", about: "Faith defined from Hebrews 11:1 and distinguished from hope" }
      ],
      topics: ["salvation", "life"]
    },
    {
      id: "b18",
      num: 281,
      prompt: "Paul contrasts the \"works of the flesh\" with the \"fruit of the Spirit.\" What is the difference, and how does that fruit grow in a believer?",
      passage: ["Galatians 5:16-26"],
      inspiration: ["John 15:1-8", "Romans 8:5-11", "Colossians 3:12-17"],
      readings: [
        { who: "J.I. Packer", work: "Keep in Step with the Spirit" },
        { who: "Gordon Fee", work: "God's Empowering Presence" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Commentary on Galatians", where: "ch. 5 (on Gal. 5:16–26)", url: "https://www.newadvent.org/fathers/23105.htm", about: "Works of the flesh versus the fruit of the Spirit" },
        { who: "John Cassian", work: "Conferences, Conference 4 (Abbot Daniel)", where: "chs. 7–11", url: "https://www.newadvent.org/fathers/350804.htm", about: "The flesh lusting against the spirit (Gal. 5:17) explained" }
      ],
      topics: ["spirit", "life"]
    },
    {
      id: "b19",
      num: 354,
      prompt: "Paul says even the greatest gifts are worthless without love. What does he say love is, and why does he call it greater than even faith and hope?",
      passage: ["1 Corinthians 13"],
      inspiration: ["1 John 4:7-21", "John 13:34-35", "Romans 13:8-10"],
      readings: [
        { who: "Augustine", work: "Homilies on the First Epistle of John" },
        { who: "C.S. Lewis", work: "The Four Loves" }
      ],
      fathers: [
        { who: "Clement of Rome", work: "First Epistle to the Corinthians (1 Clement)", where: "chs. 49–50", url: "https://www.newadvent.org/fathers/1010.htm", about: "A hymn in praise of love" },
        { who: "John Chrysostom", work: "Homily 33 on First Corinthians", where: "on 1 Cor. 13:4–8", url: "https://www.newadvent.org/fathers/220133.htm", about: "Homily on \"love suffers long and is kind\"" },
        { who: "John Chrysostom", work: "Homily 34 on First Corinthians", where: "on 1 Cor. 13:8–13", url: "https://www.newadvent.org/fathers/220134.htm", about: "Why love is greater than faith and hope" }
      ],
      topics: ["life"]
    },
    {
      id: "b20",
      num: 848,
      prompt: "David prayed this psalm after his sin with Bathsheba. What does it teach about sin, confession, and forgiveness?",
      passage: ["Psalm 51"],
      inspiration: ["2 Samuel 12:1-13", "1 John 1:8-9", "Luke 18:9-14"],
      readings: [
        { who: "Augustine", work: "Expositions on the Psalms, on Psalm 51 (his Psalm 50)" },
        { who: "Dietrich Bonhoeffer", work: "Life Together, ch. 5 (Confession and Communion)" }
      ],
      fathers: [
        { who: "Clement of Rome", work: "First Epistle to the Corinthians (1 Clement)", where: "ch. 18", url: "https://www.newadvent.org/fathers/1010.htm", about: "David's humility, quoting Psalm 51 at length" },
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 2 (On Repentance)", where: "sections 11–12", url: "https://www.newadvent.org/fathers/310102.htm", about: "David's sin, Nathan's rebuke, and David's repentance" }
      ],
      topics: ["sin", "salvation"]
    },
    {
      id: "b21",
      num: 367,
      prompt: "Jesus tells his followers not to worry. What reasons does he give for trusting God instead, and what does he tell us to seek first?",
      passage: ["Matthew 6:25-34"],
      inspiration: ["1 Peter 5:6-7", "Psalm 55:22", "Philippians 4:6-7"],
      readings: [
        { who: "Augustine", work: "Our Lord's Sermon on the Mount, Book 2" },
        { who: "Jean-Pierre de Caussade", work: "Abandonment to Divine Providence" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homily 21 on Matthew", where: "on Matt. 6:24 ff.", url: "https://www.newadvent.org/fathers/200121.htm", about: "Serving two masters, and the birds of the air" },
        { who: "John Chrysostom", work: "Homily 22 on Matthew", where: "on Matt. 6:28–34", url: "https://www.newadvent.org/fathers/200122.htm", about: "The lilies, seeking first the kingdom, and tomorrow's worries" }
      ],
      topics: ["life", "god"]
    },
    {
      id: "b22",
      num: 877,
      prompt: "Before he ascended, Jesus gave his followers a mission. What did he command them to do, and what promise did he attach to it?",
      passage: ["Matthew 28:16-20"],
      inspiration: ["Acts 1:6-11", "Genesis 12:1-3", "Romans 10:13-15"],
      readings: [
        { who: "John Stott", work: "Christian Mission in the Modern World" },
        { who: "Lesslie Newbigin", work: "The Open Secret" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homily 90 on Matthew", where: "on Matt. 28:11–20", url: "https://www.newadvent.org/fathers/200190.htm", about: "Homily on the command to disciple the nations and \"I am with you\"" },
        { who: "Basil of Caesarea", work: "On the Holy Spirit", where: "ch. 10", url: "https://www.newadvent.org/fathers/3203.htm", about: "The baptismal command of Matt. 28:19 and the Spirit's rank" }
      ],
      topics: ["church"]
    },
    {
      id: "b23",
      num: 828,
      prompt: "Paul says believers were \"baptized into Christ's death.\" What does baptism picture or do, according to the New Testament?",
      passage: ["Romans 6:1-11"],
      inspiration: ["Matthew 3:13-17", "Acts 2:38-41", "Colossians 2:11-12", "1 Peter 3:21"],
      readings: [
        { who: "Tertullian", work: "On Baptism" },
        { who: "Cyril of Jerusalem", work: "Catechetical Lectures, Mystagogical Lectures 1–2 (Lectures 19–20)" }
      ],
      fathers: [
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 3 (On Baptism)", where: "", url: "https://www.newadvent.org/fathers/310103.htm", about: "Lecture on baptism, with Romans 6:3–4 as its text" },
        { who: "John Chrysostom", work: "Homily 10 on Romans", where: "on Rom. 5:12–6:4", url: "https://www.newadvent.org/fathers/210210.htm", about: "Homily ending on baptism into Christ's death" },
        { who: "Basil of Caesarea", work: "On the Holy Spirit", where: "ch. 15", url: "https://www.ccel.org/ccel/schaff/npnf208.vii.xvi.html", about: "Baptism as a figure of burial with Christ and new life by the Spirit" }
      ],
      topics: ["church", "salvation"]
    },
    {
      id: "b24",
      num: 438,
      prompt: "What did Jesus say and do at the Last Supper, and what do Christians proclaim whenever they share the bread and the cup?",
      passage: ["1 Corinthians 11:23-26"],
      inspiration: ["Luke 22:14-20", "1 Corinthians 10:16-17", "John 6:35"],
      readings: [
        { who: "Early Church", work: "The Didache, chs. 9–10 and 14" },
        { who: "Justin Martyr", work: "First Apology, chs. 65–67" }
      ],
      fathers: [
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 22 (Mystagogical Lecture 4)", where: "", url: "https://www.newadvent.org/fathers/310122.htm", about: "Lecture on the Body and Blood of Christ, on 1 Cor. 11:23" },
        { who: "John Chrysostom", work: "Homily 27 on First Corinthians", where: "on 1 Cor. 11:17–27", url: "https://www.newadvent.org/fathers/220127.htm", about: "The Lord's Supper and the Corinthians' divided meals" },
        { who: "Irenaeus of Lyons", work: "Against Heresies, Book 4", where: "ch. 18", url: "https://www.newadvent.org/fathers/0103418.htm", about: "The Church's offering of the bread and cup" }
      ],
      topics: ["church"]
    },
    {
      id: "b25",
      num: 365,
      prompt: "Paul compares the church to a body with many parts. What does this picture teach about how believers belong to each other?",
      passage: ["1 Corinthians 12:12-27"],
      inspiration: ["Romans 12:3-8", "Ephesians 4:11-16", "1 Peter 4:10-11"],
      readings: [
        { who: "Clement of Rome", work: "First Epistle to the Corinthians (1 Clement), chs. 37–38" },
        { who: "Dietrich Bonhoeffer", work: "Life Together" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homily 30 on First Corinthians", where: "on 1 Cor. 12:12–20", url: "https://www.newadvent.org/fathers/220130.htm", about: "One body, many members, baptized by one Spirit" },
        { who: "John Chrysostom", work: "Homily 31 on First Corinthians", where: "on 1 Cor. 12:21–26", url: "https://www.newadvent.org/fathers/220131.htm", about: "Weaker members, and suffering and rejoicing together" },
        { who: "Origen", work: "Against Celsus, Book 6", where: "ch. 48", url: "https://www.ccel.org/ccel/schaff/anf04.vi.ix.vi.xlviii.html", about: "The whole Church as the body of Christ" }
      ],
      topics: ["church"]
    },
    {
      id: "b26",
      num: 488,
      prompt: "What is \"the armor of God,\" and what does it teach about the spiritual struggle Christians face?",
      passage: ["Ephesians 6:10-18"],
      inspiration: ["Isaiah 59:15-17", "1 Peter 5:8-9", "James 4:7-8"],
      readings: [
        { who: "William Gurnall", work: "The Christian in Complete Armour" },
        { who: "C.S. Lewis", work: "The Screwtape Letters" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homily 22 on Ephesians", where: "on Eph. 6:5–13", url: "https://www.newadvent.org/fathers/230122.htm", about: "Wrestling not against flesh and blood; putting on God's armor" },
        { who: "John Chrysostom", work: "Homily 24 on Ephesians", where: "on Eph. 6:14–17 ff.", url: "https://www.newadvent.org/fathers/230124.htm", about: "Breastplate, shield, helmet, sword, and prayer explained" },
        { who: "Ignatius of Antioch", work: "Epistle to Polycarp", where: "ch. 6", url: "https://www.newadvent.org/fathers/0110.htm", about: "Baptism, faith, love, and patience pictured as a soldier's armor" }
      ],
      topics: ["life", "sin"]
    },
    {
      id: "b27",
      num: 153,
      prompt: "What does Jonah's story teach about God's mercy? Why is Jonah angry when God spares Nineveh, and how does God answer him?",
      passage: ["Jonah 3", "Jonah 4"],
      inspiration: ["Exodus 34:6-7", "Matthew 12:38-41", "Luke 15:25-32"],
      readings: [
        { who: "Timothy Keller", work: "The Prodigal Prophet" },
        { who: "John Calvin", work: "Commentaries on the Twelve Minor Prophets, on Jonah" }
      ],
      fathers: [
        { who: "Tertullian", work: "Against Marcion, Book 2", where: "ch. 24", url: "https://www.ccel.org/ccel/schaff/anf03.v.iv.iii.xxiv.html", about: "What God's \"repenting\" over Nineveh means" },
        { who: "Augustine", work: "Letter 102 (to Deogratias)", where: "Question 6, sections 30–37", url: "https://www.newadvent.org/fathers/1102102.htm", about: "Questions on Jonah: the great fish, the gourd, and the worm" }
      ],
      topics: ["god", "salvation"]
    },
    {
      id: "b28",
      num: 149,
      prompt: "After Jesus calms the storm, his disciples ask, \"Who is this?\" How would you answer them from this passage and the Old Testament?",
      passage: ["Mark 4:35-41"],
      inspiration: ["Psalm 107:23-30", "Psalm 89:8-9", "Mark 6:45-52"],
      readings: [
        { who: "Richard Bauckham", work: "Jesus and the God of Israel" },
        { who: "C.S. Lewis", work: "Miracles" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homily 28 on Matthew", where: "on Matt. 8:23 ff.", url: "https://www.newadvent.org/fathers/200128.htm", about: "Homily on the calming of the storm (parallel to Mark 4)" },
        { who: "Augustine", work: "Sermon 13 on New Testament Lessons (Ben. 63)", where: "on Matt. 8:23", url: "https://www.newadvent.org/fathers/160313.htm", about: "Christ asleep in the boat during the storm" }
      ],
      topics: ["christ"]
    },
    {
      id: "b29",
      num: 798,
      prompt: "Why did Jesus wash his disciples' feet, and what did he want them to learn from it?",
      passage: ["John 13:1-17"],
      inspiration: ["Philippians 2:3-8", "Mark 10:42-45", "Luke 22:24-27"],
      readings: [
        { who: "Augustine", work: "Tractates on the Gospel of John, 55–59" },
        { who: "Andrew Murray", work: "Humility" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homily 70 on the Gospel of John", where: "on John 13:1–2 ff.", url: "https://www.newadvent.org/fathers/240170.htm", about: "Homily on Jesus washing the disciples' feet" },
        { who: "John Chrysostom", work: "Homily 71 on the Gospel of John", where: "on John 13:1–18", url: "https://www.newadvent.org/fathers/240171.htm", about: "\"You also ought to wash one another's feet\"" },
        { who: "Ambrose", work: "On the Mysteries", where: "ch. 6", url: "https://www.newadvent.org/fathers/3405.htm", about: "Foot-washing after baptism, read in light of John 13" }
      ],
      topics: ["christ", "life"]
    },
    {
      id: "b30",
      num: 525,
      prompt: "How does the Bible's final vision describe the future God has promised? What will be there, and what will be gone?",
      passage: ["Revelation 21:1-7", "Revelation 22:1-5"],
      inspiration: ["Isaiah 65:17-25", "Romans 8:18-23", "2 Peter 3:13"],
      readings: [
        { who: "N.T. Wright", work: "Surprised by Hope" },
        { who: "Augustine", work: "City of God, Book 22" }
      ],
      fathers: [
        { who: "Irenaeus of Lyons", work: "Against Heresies, Book 5", where: "ch. 35", url: "https://www.newadvent.org/fathers/0103535.htm", about: "The new heaven, new earth, and new Jerusalem of Revelation 21" },
        { who: "Irenaeus of Lyons", work: "Against Heresies, Book 5", where: "ch. 36", url: "https://www.newadvent.org/fathers/0103536.htm", about: "Creation renewed after the present world passes away" },
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 15", where: "sections 3–4", url: "https://www.newadvent.org/fathers/310115.htm", about: "The present world passing away and being renewed" }
      ],
      topics: ["hope"]
    }
  ],

  moderate: [
    {
      id: "m1",
      num: 469,
      prompt: "How does the Passover help explain the Last Supper and the meaning of Jesus' death?",
      passage: ["Exodus 12:1-14", "Luke 22:7-20"],
      inspiration: ["1 Corinthians 5:7", "John 1:29", "John 19:31-36"],
      readings: [
        { who: "Melito of Sardis", work: "On Pascha" },
        { who: "Brant Pitre", work: "Jesus and the Jewish Roots of the Eucharist" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homilies on Matthew", where: "Homily 82 (Matt 26:26-28)", url: "https://www.newadvent.org/fathers/200182.htm", about: "Homily on the Last Supper, instituted at Passover; the type giving way to the truth" },
        { who: "Gregory of Nazianzus", work: "Oration 45 (Second Oration on Easter)", where: "Sections 11-16", url: "https://www.newadvent.org/fathers/310245.htm", about: "Easter sermon reading the Passover lamb and its rites as pointing to Christ" },
        { who: "Justin Martyr", work: "Dialogue with Trypho", where: "Chapter 40", url: "https://www.newadvent.org/fathers/01283.htm", about: "The roasted Passover lamb as a figure of Christ's cross" }
      ],
      topics: ["christ", "covenant", "church"]
    },
    {
      id: "m2",
      num: 950,
      prompt: "Paul says a person is justified by faith apart from works of the law. James says a person is justified by works and not by faith alone. How do these fit together?",
      passage: ["Romans 3:21-28", "James 2:14-26"],
      inspiration: ["Galatians 5:6", "Genesis 15:6", "Ephesians 2:8-10"],
      readings: [
        { who: "Martin Luther", work: "Preface to the Epistle to the Romans" },
        { who: "Council of Trent", work: "Session 6, Decree on Justification" },
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 3, ch. 17" }
      ],
      fathers: [
        { who: "Clement of Rome", work: "First Epistle to the Corinthians (1 Clement)", where: "Chapters 32-33", url: "https://www.newadvent.org/fathers/1010.htm", about: "Justified by faith, not our own works; yet good works must not be abandoned" },
        { who: "Augustine", work: "On Grace and Free Will", where: "Chapter 18", url: "https://www.newadvent.org/fathers/1510.htm", about: "Reconciling Paul and James: the faith that works by love" },
        { who: "John Chrysostom", work: "Homilies on Romans", where: "Homily 7 (Rom 3:9-31)", url: "https://www.newadvent.org/fathers/210207.htm", about: "Homily on God's righteousness apart from the Law, received through faith" }
      ],
      topics: ["salvation"]
    },
    {
      id: "m3",
      num: 324,
      prompt: "How does God's covenant with Abraham shape Paul's argument about who belongs to God's family?",
      passage: ["Genesis 12:1-3", "Galatians 3:6-29"],
      inspiration: ["Genesis 15:6", "Genesis 17:1-8", "Romans 4"],
      readings: [
        { who: "O. Palmer Robertson", work: "The Christ of the Covenants" },
        { who: "Scott Hahn", work: "Kinship by Covenant" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homilies on Galatians", where: "Homily 3 (Galatians 3)", url: "https://www.newadvent.org/fathers/23103.htm", about: "Homily on Abraham's faith, the promised seed, and the Law's temporary role" },
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 4, Chapter 21", url: "https://www.newadvent.org/fathers/0103421.htm", about: "Abraham's faith as identical with Christian faith; patriarchs prefiguring the Church" },
        { who: "Justin Martyr", work: "Dialogue with Trypho", where: "Chapters 119-120", url: "https://www.newadvent.org/fathers/01288.htm", about: "Believers from the nations as the people promised to Abraham" }
      ],
      topics: ["covenant", "salvation"]
    },
    {
      id: "m4",
      num: 313,
      prompt: "Trace the theme of God dwelling with his people from Eden to the tabernacle, the temple, Jesus, the church, and the new creation. What does this story reveal?",
      passage: ["Exodus 40:34-38", "John 1:14", "Revelation 21:3"],
      inspiration: ["Genesis 3:8", "1 Kings 8:10-11", "1 Corinthians 3:16", "Ezekiel 43:1-7"],
      readings: [
        { who: "G.K. Beale", work: "The Temple and the Church's Mission" },
        { who: "Yves Congar", work: "The Mystery of the Temple" }
      ],
      fathers: [
        { who: "Barnabas (attributed)", work: "Epistle of Barnabas", where: "Chapter 16", url: "https://www.newadvent.org/fathers/0124.htm", about: "The true, spiritual temple of God built in believers' hearts" },
        { who: "John Chrysostom", work: "Homilies on the Gospel of John", where: "Homily 11 (John 1:14)", url: "https://www.newadvent.org/fathers/240111.htm", about: "Homily on 'the Word was made flesh and dwelt among us'" }
      ],
      topics: ["god", "church", "covenant"]
    },
    {
      id: "m5",
      num: 155,
      prompt: "The title Jesus used most often for himself was \"Son of Man.\" How does Daniel's vision shape what that title means, and why did Jesus' use of it at his trial provoke such a reaction?",
      passage: ["Daniel 7:13-14", "Mark 14:61-64"],
      inspiration: ["Matthew 26:64", "Mark 2:10", "Mark 8:31"],
      readings: [
        { who: "N.T. Wright", work: "Jesus and the Victory of God" },
        { who: "Richard Bauckham", work: "Jesus and the God of Israel" }
      ],
      fathers: [
        { who: "Justin Martyr", work: "Dialogue with Trypho", where: "Chapter 31", url: "https://www.newadvent.org/fathers/01283.htm", about: "Quotes Daniel 7's Son of Man vision of Christ's glorious coming" },
        { who: "John Chrysostom", work: "Homilies on Matthew", where: "Homily 84 (Matt 26:51-66)", url: "https://www.newadvent.org/fathers/200184.htm", about: "Homily on Jesus' answer to the high priest and the blasphemy charge" },
        { who: "Cyril of Jerusalem", work: "Catechetical Lectures", where: "Lecture 15", url: "https://www.newadvent.org/fathers/310115.htm", about: "Lecture on Christ's coming in glory, drawing on Daniel 7" }
      ],
      topics: ["christ"]
    },
    {
      id: "m6",
      num: 197,
      prompt: "Job's friends assume his suffering must be punishment for sin. How do Job's story and Jesus' own words challenge that assumption?",
      passage: ["Job 1-2", "John 9:1-3"],
      inspiration: ["Job 38-42", "Luke 13:1-5", "2 Corinthians 4:16-18"],
      readings: [
        { who: "Gregory the Great", work: "Moralia in Job" },
        { who: "D.A. Carson", work: "How Long, O Lord?" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homilies on the Gospel of John", where: "Homily 56 (John 9:1-2)", url: "https://www.newadvent.org/fathers/240156.htm", about: "Homily on whether the man's blindness came from his or his parents' sin" },
        { who: "Augustine", work: "Tractates on the Gospel of John", where: "Tractate 44 (John 9)", url: "https://www.newadvent.org/fathers/1701044.htm", about: "Sermon on the man born blind 'that the works of God be manifest'" }
      ],
      topics: ["sin"]
    },
    {
      id: "m7",
      num: 444,
      prompt: "How does the Day of Atonement help explain what the letter to the Hebrews says about Jesus as our high priest?",
      passage: ["Leviticus 16", "Hebrews 9:11-14"],
      inspiration: ["Hebrews 4:14-16", "Hebrews 10:1-14", "Romans 3:25"],
      readings: [
        { who: "John Chrysostom", work: "Homilies on Hebrews" },
        { who: "John Owen", work: "An Exposition of the Epistle to the Hebrews" }
      ],
      fathers: [
        { who: "Barnabas (attributed)", work: "Epistle of Barnabas", where: "Chapter 7", url: "https://www.newadvent.org/fathers/0124.htm", about: "The Day of Atonement fast and the goats as types of Christ" },
        { who: "John Chrysostom", work: "Homilies on Hebrews", where: "Homily 15 (Heb 9:1-14)", url: "https://www.newadvent.org/fathers/240215.htm", about: "Homily contrasting the yearly high-priestly entry with Christ's once-for-all entry" },
        { who: "Justin Martyr", work: "Dialogue with Trypho", where: "Chapter 40", url: "https://www.newadvent.org/fathers/01283.htm", about: "The two goats of the fast as figures of Christ's two comings" }
      ],
      topics: ["christ", "salvation", "covenant"]
    },
    {
      id: "m8",
      num: 461,
      prompt: "Paul sets Adam and Christ side by side. What does each one bring to humanity, and why does Paul compare them?",
      passage: ["Romans 5:12-21", "1 Corinthians 15:21-22"],
      inspiration: ["1 Corinthians 15:45-49", "Genesis 3", "Genesis 2:15-17"],
      readings: [
        { who: "Irenaeus of Lyons", work: "Against Heresies, Book 3" },
        { who: "Augustine", work: "City of God, Book 13" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homilies on Romans", where: "Homily 10 (Rom 5:12-21)", url: "https://www.newadvent.org/fathers/210210.htm", about: "Homily on Adam's disobedience and Christ's obedience and abounding grace" },
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 5, Chapter 21", url: "https://www.newadvent.org/fathers/0103521.htm", about: "Christ recapitulating Adam, conquering the enemy who conquered humanity" }
      ],
      topics: ["sin", "salvation", "christ"]
    },
    {
      id: "m9",
      num: 317,
      prompt: "How does Pentecost relate to the Tower of Babel and to the prophet Joel's promise?",
      passage: ["Acts 2:1-21"],
      inspiration: ["Genesis 11:1-9", "Joel 2:28-32", "Numbers 11:24-29"],
      readings: [
        { who: "Cyril of Jerusalem", work: "Catechetical Lectures 16–17" },
        { who: "Sinclair Ferguson", work: "The Holy Spirit" }
      ],
      fathers: [
        { who: "Gregory of Nazianzus", work: "Oration 41 (On Pentecost)", where: "Sections 13, 16", url: "https://www.newadvent.org/fathers/310241.htm", about: "Pentecost sermon contrasting the tongues with Babel's confusion; cites Joel" },
        { who: "John Chrysostom", work: "Homilies on the Acts of the Apostles", where: "Homily 4 (Acts 2:1ff.)", url: "https://www.newadvent.org/fathers/210104.htm", about: "Homily on the Spirit's coming at Pentecost and the gift of tongues" },
        { who: "John Chrysostom", work: "Homilies on the Acts of the Apostles", where: "Homily 5 (Acts 2:14-20)", url: "https://www.newadvent.org/fathers/210105.htm", about: "Homily on Peter's sermon quoting Joel's prophecy" }
      ],
      topics: ["spirit", "church"]
    },
    {
      id: "m10",
      num: 654,
      prompt: "Jesus said he came not to abolish the Law but to fulfill it. In the Sermon on the Mount, how does he relate to the Law of Moses?",
      passage: ["Matthew 5:17-48"],
      inspiration: ["Jeremiah 31:31-34", "Romans 10:4", "Romans 13:8-10"],
      readings: [
        { who: "Augustine", work: "Our Lord's Sermon on the Mount" },
        { who: "Dietrich Bonhoeffer", work: "Discipleship (The Cost of Discipleship)" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homilies on Matthew", where: "Homily 16 (Matt 5:17-20)", url: "https://www.newadvent.org/fathers/200116.htm", about: "Homily on 'I came not to destroy the Law but to fulfil'" },
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 4, Chapter 13", url: "https://www.newadvent.org/fathers/0103413.htm", about: "Christ extending and fulfilling, not abolishing, the Law's natural precepts" }
      ],
      topics: ["covenant", "christ"]
    },
    {
      id: "m11",
      num: 826,
      prompt: "Who is Melchizedek, and why does Hebrews use this mysterious figure to explain Jesus' priesthood?",
      passage: ["Hebrews 7"],
      inspiration: ["Genesis 14:17-20", "Psalm 110", "Hebrews 5:5-10"],
      readings: [
        { who: "John Chrysostom", work: "Homilies on Hebrews" },
        { who: "John Owen", work: "An Exposition of the Epistle to the Hebrews" }
      ],
      fathers: [
        { who: "Cyprian of Carthage", work: "Epistle 62 (to Caecilius)", where: "Sections 4-5", url: "https://www.newadvent.org/fathers/050662.htm", about: "Melchizedek's bread and wine as a figure of Christ's priesthood" },
        { who: "Augustine", work: "City of God", where: "Book 16, Chapter 22", url: "https://www.newadvent.org/fathers/120116.htm", about: "Melchizedek blessing Abraham; priest forever after his order" },
        { who: "Ambrose", work: "On the Mysteries", where: "Chapter 8", url: "https://www.newadvent.org/fathers/3405.htm", about: "Melchizedek's offering compared with the Christian sacrament" }
      ],
      topics: ["christ", "covenant"]
    },
    {
      id: "m12",
      num: 652,
      prompt: "How do Isaiah's \"Servant\" passages help the New Testament explain who Jesus is and what he came to do?",
      passage: ["Isaiah 52:13-15", "Isaiah 53"],
      inspiration: ["Isaiah 42:1-4", "Matthew 12:15-21", "Acts 8:26-35", "1 Peter 2:21-25"],
      readings: [
        { who: "Justin Martyr", work: "Dialogue with Trypho, ch. 13" },
        { who: "John Stott", work: "The Cross of Christ" }
      ],
      fathers: [
        { who: "Clement of Rome", work: "First Epistle to the Corinthians (1 Clement)", where: "Chapter 16", url: "https://www.newadvent.org/fathers/1010.htm", about: "Quotes Isaiah 53 at length of Christ as example of humility" },
        { who: "John Chrysostom", work: "Homilies on the Acts of the Apostles", where: "Homily 19 (Acts 8:26-40)", url: "https://www.newadvent.org/fathers/210119.htm", about: "Homily on Philip and the Ethiopian reading Isaiah 53" },
        { who: "Augustine", work: "City of God", where: "Book 18, Chapter 29", url: "https://www.newadvent.org/fathers/120118.htm", about: "Isaiah's predictions of Christ and the Church, from Isaiah 52:13" }
      ],
      topics: ["christ", "salvation"]
    },
    {
      id: "m13",
      num: 239,
      prompt: "The exodus from Egypt is the Old Testament's great story of rescue. How do the prophets and the New Testament use it to describe salvation in Christ?",
      passage: ["Exodus 14"],
      inspiration: ["Isaiah 43:16-19", "Luke 9:28-31", "1 Corinthians 10:1-4"],
      readings: [
        { who: "Melito of Sardis", work: "On Pascha" },
        { who: "Gregory of Nyssa", work: "The Life of Moses" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homilies on First Corinthians", where: "Homily 23 (1 Cor 9:24-10:12)", url: "https://www.newadvent.org/fathers/220123.htm", about: "Homily on the sea crossing as type of baptism; the Rock was Christ" },
        { who: "Ambrose", work: "On the Mysteries", where: "Chapter 3", url: "https://www.newadvent.org/fathers/3405.htm", about: "The Red Sea crossing as a figure of baptism" },
        { who: "Tertullian", work: "On Baptism", where: "Chapter 9", url: "https://www.newadvent.org/fathers/0321.htm", about: "Types of baptism in the Red Sea and water from the rock" }
      ],
      topics: ["salvation", "covenant"]
    },
    {
      id: "m14",
      num: 468,
      prompt: "God promised David a son whose throne would last forever. How does that promise shape the way the New Testament presents Jesus?",
      passage: ["2 Samuel 7:8-16"],
      inspiration: ["Psalm 89:3-4", "Isaiah 9:6-7", "Luke 1:30-33", "Acts 2:29-36"],
      readings: [
        { who: "Augustine", work: "City of God, Book 17" },
        { who: "O. Palmer Robertson", work: "The Christ of the Covenants" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homilies on the Acts of the Apostles", where: "Homily 6 (Acts 2:22-36)", url: "https://www.newadvent.org/fathers/210106.htm", about: "Homily on Peter's argument from God's oath to David" },
        { who: "Lactantius", work: "Divine Institutes", where: "Book 4, Chapter 13", url: "https://www.newadvent.org/fathers/07014.htm", about: "The promise of David's everlasting throne applied to Christ, not Solomon" }
      ],
      topics: ["christ", "covenant"]
    },
    {
      id: "m15",
      num: 506,
      prompt: "Genesis says humans were made in God's image; Paul calls Christ \"the image of God.\" How does the New Testament connect the two, and what does it say God is doing to that image in us?",
      passage: ["2 Corinthians 3:18", "2 Corinthians 4:1-6"],
      inspiration: ["Genesis 1:26-27", "Colossians 1:15", "Romans 8:29", "Colossians 3:9-10"],
      readings: [
        { who: "Athanasius", work: "On the Incarnation, chs. 11–14" },
        { who: "Gregory of Nyssa", work: "On the Making of Man" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homilies on Second Corinthians", where: "Homily 7 (2 Cor 3:7-18)", url: "https://www.newadvent.org/fathers/220207.htm", about: "Homily on being transformed into the same image from glory to glory" },
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 5, Chapter 16", url: "https://www.newadvent.org/fathers/0103516.htm", about: "The incarnate Word showing the true image and restoring the likeness" },
        { who: "Augustine", work: "On the Trinity", where: "Book 14, Chapter 17", url: "https://www.newadvent.org/fathers/130114.htm", about: "How the image of God in us is renewed day by day" }
      ],
      topics: ["creation", "christ"]
    },
    {
      id: "m16",
      num: 398,
      prompt: "Jesus announced that \"the kingdom of God has come near.\" What is the kingdom, and how is it both here now and still to come?",
      passage: ["Mark 1:14-15"],
      inspiration: ["Daniel 2:44", "Matthew 13:31-33", "Luke 17:20-21", "Revelation 11:15"],
      readings: [
        { who: "George Eldon Ladd", work: "The Gospel of the Kingdom" },
        { who: "N.T. Wright", work: "Jesus and the Victory of God" }
      ],
      fathers: [
        { who: "Cyprian of Carthage", work: "On the Lord's Prayer (Treatise 4)", where: "Section 13", url: "https://www.newadvent.org/fathers/050704.htm", about: "On 'Thy kingdom come'; Christ himself as the kingdom of God" },
        { who: "Tertullian", work: "On Prayer", where: "Chapter 5", url: "https://www.newadvent.org/fathers/0322.htm", about: "On the petition 'Thy kingdom come' and longing for its arrival" }
      ],
      topics: ["christ", "hope"]
    },
    {
      id: "m17",
      num: 421,
      prompt: "If no one is made right with God by keeping the Law, why did God give it? How do Paul and the Psalms describe the Law's purpose?",
      passage: ["Galatians 3:19-25"],
      inspiration: ["Romans 7:7-12", "Romans 3:19-20", "Psalm 119:97-105"],
      readings: [
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 2, ch. 7" },
        { who: "Martin Luther", work: "Commentary on Galatians" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homilies on Galatians", where: "Homily 3 (Galatians 3)", url: "https://www.newadvent.org/fathers/23103.htm", about: "Homily on why the Law was added and its role as tutor until Christ" },
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 4, Chapter 16", url: "https://www.newadvent.org/fathers/0103416.htm", about: "Why the Law was given; patriarchs righteous without it; Decalogue's abiding place" },
        { who: "John Chrysostom", work: "Homilies on Romans", where: "Homily 12 (Rom 6:19-7:13)", url: "https://www.newadvent.org/fathers/210212.htm", about: "Homily on the Law revealing sin, yet holy, just and good" }
      ],
      topics: ["covenant", "salvation"]
    },
    {
      id: "m18",
      num: 924,
      prompt: "Proverbs pictures Wisdom as present with God at creation. How did the New Testament writers and the early church connect this figure to Christ?",
      passage: ["Proverbs 8:22-31"],
      inspiration: ["1 Corinthians 1:24", "1 Corinthians 1:30", "John 1:1-3", "Colossians 2:2-3"],
      readings: [
        { who: "Athanasius", work: "Four Discourses Against the Arians, Discourse 2" },
        { who: "Augustine", work: "On the Trinity" }
      ],
      fathers: [
        { who: "Justin Martyr", work: "Dialogue with Trypho", where: "Chapter 61", url: "https://www.newadvent.org/fathers/01285.htm", about: "Quotes Proverbs 8: Wisdom begotten of the Father, identified as Christ" },
        { who: "Origen", work: "De Principiis (On First Principles)", where: "Book 1, Chapter 2", url: "https://www.newadvent.org/fathers/04121.htm", about: "Christ as the Wisdom of God, citing Proverbs 8" }
      ],
      topics: ["christ", "god"]
    },
    {
      id: "m19",
      num: 160,
      prompt: "What was the Sabbath for? How does the New Testament treat it after Christ, and why did Christians come to gather on Sunday?",
      passage: ["Mark 2:23-28", "Mark 3:1-6"],
      inspiration: ["Genesis 2:2-3", "Exodus 20:8-11", "Hebrews 4:1-11", "Acts 20:7", "Revelation 1:10"],
      readings: [
        { who: "Ignatius of Antioch", work: "Letter to the Magnesians, ch. 9" },
        { who: "Justin Martyr", work: "First Apology, ch. 67" }
      ],
      fathers: [
        { who: "Barnabas (attributed)", work: "Epistle of Barnabas", where: "Chapter 15", url: "https://www.newadvent.org/fathers/0124.htm", about: "The false and true Sabbath; Christians keep the eighth day of resurrection" },
        { who: "John Chrysostom", work: "Homilies on Matthew", where: "Homily 39 (Matt 12:1-8)", url: "https://www.newadvent.org/fathers/200139.htm", about: "Homily on plucking grain on the Sabbath; Son of Man Lord of the Sabbath" },
        { who: "Justin Martyr", work: "Dialogue with Trypho", where: "Chapter 21", url: "https://www.newadvent.org/fathers/01282.htm", about: "Why the Sabbath was instituted for Israel" }
      ],
      topics: ["life", "covenant"]
    },
    {
      id: "m20",
      num: 697,
      prompt: "Paul says that Gentile believers have been grafted into Israel's olive tree. How does the New Testament describe the relationship between Israel and the church?",
      passage: ["Romans 11:11-32"],
      inspiration: ["Ephesians 2:11-22", "Galatians 6:15-16", "Jeremiah 31:35-37"],
      readings: [
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 2, chs. 10–11" },
        { who: "Justin Martyr", work: "Dialogue with Trypho" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homilies on Romans", where: "Homily 19 (Rom 11:7-34)", url: "https://www.newadvent.org/fathers/210219.htm", about: "Homily on the olive tree, grafted branches, and 'all Israel shall be saved'" },
        { who: "John Chrysostom", work: "Homilies on Ephesians", where: "Homily 5 (Eph 2:11-16)", url: "https://www.newadvent.org/fathers/230105.htm", about: "Homily on Jew and Gentile made one new man in Christ" }
      ],
      topics: ["covenant", "church"]
    },
    {
      id: "m21",
      num: 140,
      prompt: "Jesus calls himself \"the bread of life.\" How does the manna in the wilderness help explain what he means?",
      passage: ["John 6:25-51"],
      inspiration: ["Exodus 16:1-21", "Deuteronomy 8:3", "Matthew 4:4"],
      readings: [
        { who: "Augustine", work: "Tractates on the Gospel of John, 25–26" },
        { who: "Brant Pitre", work: "Jesus and the Jewish Roots of the Eucharist" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homilies on the Gospel of John", where: "Homily 45 (John 6:28-40)", url: "https://www.newadvent.org/fathers/240145.htm", about: "Homily contrasting the manna with Christ the bread of life" },
        { who: "Ambrose", work: "On the Mysteries", where: "Chapter 8", url: "https://www.newadvent.org/fathers/3405.htm", about: "The manna compared with the living bread from heaven" }
      ],
      topics: ["christ", "church"]
    },
    {
      id: "m22",
      num: 482,
      prompt: "Where do we find hope of resurrection in the Old Testament, and how did Jesus and the apostles read those texts?",
      passage: ["Daniel 12:1-3"],
      inspiration: ["Job 19:25-27", "Ezekiel 37:1-14", "Isaiah 26:19", "Mark 12:24-27", "Acts 2:24-32"],
      readings: [
        { who: "Athenagoras", work: "On the Resurrection of the Dead" },
        { who: "N.T. Wright", work: "The Resurrection of the Son of God" }
      ],
      fathers: [
        { who: "Cyril of Jerusalem", work: "Catechetical Lectures", where: "Lecture 18, section 15", url: "https://www.newadvent.org/fathers/310118.htm", about: "Old Testament witnesses to resurrection: Ezekiel 37, Daniel 12, Isaiah 26" },
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 5, Chapter 15", url: "https://www.newadvent.org/fathers/0103515.htm", about: "Isaiah 26:19 and Ezekiel's dry bones as prophecies of bodily resurrection" },
        { who: "John Chrysostom", work: "Homilies on Matthew", where: "Homily 70 (Matt 22:15-33)", url: "https://www.newadvent.org/fathers/200170.htm", about: "Homily on the Sadducees and 'the God of Abraham... of the living'" }
      ],
      topics: ["hope"]
    },
    {
      id: "m23",
      num: 251,
      prompt: "Joseph tells his brothers, \"You meant evil against me, but God meant it for good.\" How does his story show the way God works through human evil, and how does it point toward the cross?",
      passage: ["Genesis 50:15-21"],
      inspiration: ["Genesis 45:4-8", "Acts 4:27-28", "Romans 8:28"],
      readings: [
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 1, chs. 16–18" },
        { who: "Westminster Assembly", work: "Westminster Confession of Faith, ch. 5 (Of Providence)" }
      ],
      fathers: [
        { who: "Tertullian", work: "An Answer to the Jews", where: "Chapter 10", url: "https://www.newadvent.org/fathers/0308.htm", about: "Joseph, persecuted and sold by his brothers, as a figure of Christ's passion" },
        { who: "John Chrysostom", work: "Homilies on Romans", where: "Homily 15 (Rom 8:28-39)", url: "https://www.newadvent.org/fathers/210215.htm", about: "Homily on 'all things work together for good to them that love God'" },
        { who: "Augustine", work: "Enchiridion", where: "Chapter 11", url: "https://www.newadvent.org/fathers/1302.htm", about: "God, being good and almighty, able to bring good even out of evil" }
      ],
      topics: ["god", "sin"]
    },
    {
      id: "m24",
      num: 353,
      prompt: "The last of the prophets promised that Elijah would come again before the day of the Lord. How do the Gospels connect that promise to John the Baptist?",
      passage: ["Matthew 11:7-15"],
      inspiration: ["Malachi 4:5-6", "Luke 1:13-17", "Matthew 17:10-13", "John 1:19-23"],
      readings: [
        { who: "John Chrysostom", work: "Homilies on the Gospel of Matthew" },
        { who: "N.T. Wright", work: "Jesus and the Victory of God" }
      ],
      fathers: [
        { who: "Augustine", work: "Tractates on the Gospel of John", where: "Tractate 4 (John 1:19-33)", url: "https://www.newadvent.org/fathers/1701004.htm", about: "How John could deny being Elijah while Christ calls him Elijah" },
        { who: "Justin Martyr", work: "Dialogue with Trypho", where: "Chapters 49-51", url: "https://www.newadvent.org/fathers/01284.htm", about: "Elijah's coming and John as forerunner of Christ's first advent" },
        { who: "John Chrysostom", work: "Homilies on Matthew", where: "Homily 37 (Matt 11:7ff.)", url: "https://www.newadvent.org/fathers/200137.htm", about: "Homily on 'if ye will receive it, this is Elias'" }
      ],
      topics: ["christ", "covenant"]
    },
    {
      id: "m25",
      num: 129,
      prompt: "What does the \"new covenant\" promised by the prophets offer, and how does the New Testament say it is fulfilled?",
      passage: ["Jeremiah 31:31-34"],
      inspiration: ["Ezekiel 36:24-28", "Luke 22:20", "Hebrews 8:6-13", "2 Corinthians 3:4-6"],
      readings: [
        { who: "Augustine", work: "On the Spirit and the Letter" },
        { who: "O. Palmer Robertson", work: "The Christ of the Covenants" }
      ],
      fathers: [
        { who: "Justin Martyr", work: "Dialogue with Trypho", where: "Chapter 11", url: "https://www.newadvent.org/fathers/01282.htm", about: "The new covenant promised by God, citing Jeremiah" },
        { who: "John Chrysostom", work: "Homilies on Hebrews", where: "Homily 14 (Heb 8:1-13)", url: "https://www.newadvent.org/fathers/240214.htm", about: "Homily on Jeremiah's new covenant and laws written on hearts" }
      ],
      topics: ["covenant", "spirit"]
    },
    {
      id: "m26",
      num: 295,
      prompt: "On the cross Jesus cried, \"My God, my God, why have you forsaken me?\" quoting a psalm. How does the whole psalm shed light on the crucifixion?",
      passage: ["Psalm 22"],
      inspiration: ["Mark 15:33-39", "Matthew 27:35-46", "Hebrews 2:10-12"],
      readings: [
        { who: "Augustine", work: "Expositions on the Psalms, on Psalm 22 (his Psalm 21)" },
        { who: "Charles Spurgeon", work: "The Treasury of David, on Psalm 22" }
      ],
      fathers: [
        { who: "Justin Martyr", work: "Dialogue with Trypho", where: "Chapters 98-106", url: "https://www.newadvent.org/fathers/01287.htm", about: "Verse-by-verse reading of Psalm 22 as predicting Christ's passion and resurrection" },
        { who: "John Chrysostom", work: "Homilies on Matthew", where: "Homily 88 (Matt 27:45-48)", url: "https://www.newadvent.org/fathers/200188.htm", about: "Homily on Jesus' cry 'Eli, Eli, lama sabachthani'" }
      ],
      topics: ["christ", "salvation"]
    },
    {
      id: "m27",
      num: 351,
      prompt: "Why does Jesus call himself \"the true vine\"? How do the Old Testament's pictures of Israel as God's vine help explain his words?",
      passage: ["John 15:1-11"],
      inspiration: ["Isaiah 5:1-7", "Psalm 80:8-19", "Jeremiah 2:21"],
      readings: [
        { who: "Augustine", work: "Tractates on the Gospel of John, 80–83" },
        { who: "Andrew Murray", work: "Abide in Christ" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homilies on the Gospel of John", where: "Homily 76 (John 14:31-15:10)", url: "https://www.newadvent.org/fathers/240176.htm", about: "Homily on the true vine, the branches, and abiding in Christ" },
        { who: "Cyril of Alexandria", work: "Commentary on John", where: "Book 10 (John 15:1ff.)", url: "https://www.tertullian.org/fathers/cyril_on_john_10_book10.htm", about: "Commentary on 'I am the true Vine' and the Father as husbandman" },
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 4, Chapter 36", url: "https://www.newadvent.org/fathers/0103436.htm", about: "The parable of God's vineyard across the Mosaic and Christian dispensations" }
      ],
      topics: ["christ", "life"]
    },
    {
      id: "m28",
      num: 414,
      prompt: "Paul says marriage points to Christ and the church. How does the Bible use marriage to describe God's relationship with his people, from the prophets to Revelation?",
      passage: ["Ephesians 5:21-33"],
      inspiration: ["Hosea 2:14-20", "Isaiah 54:5-8", "Revelation 19:6-9"],
      readings: [
        { who: "Augustine", work: "On the Good of Marriage" },
        { who: "Bernard of Clairvaux", work: "Sermons on the Song of Songs" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homilies on Ephesians", where: "Homily 20 (Eph 5:22-33)", url: "https://www.newadvent.org/fathers/230120.htm", about: "Homily on marriage and the 'great mystery' of Christ and the Church" },
        { who: "Methodius of Olympus", work: "Banquet of the Ten Virgins", where: "Discourse 3, Chapters 1 and 8", url: "https://www.newadvent.org/fathers/062303.htm", about: "Adam and Eve read with Ephesians 5 as Christ and the Church" }
      ],
      topics: ["church", "covenant"]
    },
    {
      id: "m29",
      num: 763,
      prompt: "How do the apostles' teachings about Christ's return build on the Old Testament's \"day of the Lord\"? How should that hope shape the way Christians live now?",
      passage: ["1 Thessalonians 4:13-18", "1 Thessalonians 5:1-11"],
      inspiration: ["Amos 5:18-20", "Zephaniah 1:14-16", "Matthew 24:36-44", "2 Peter 3:8-13"],
      readings: [
        { who: "Augustine", work: "City of God, Book 20" },
        { who: "N.T. Wright", work: "Surprised by Hope" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homilies on First Thessalonians", where: "Homily 9 (1 Thess 5:1-11)", url: "https://www.newadvent.org/fathers/230409.htm", about: "Homily on the day of the Lord as a thief; watchfulness and sobriety" },
        { who: "Cyril of Jerusalem", work: "Catechetical Lectures", where: "Lecture 15", url: "https://www.newadvent.org/fathers/310115.htm", about: "Lecture on Christ's coming in glory to judge, citing 1 Thessalonians 4" },
        { who: "Early Church", work: "The Didache (Teaching of the Twelve Apostles)", where: "Chapter 16", url: "https://www.newadvent.org/fathers/0714.htm", about: "Watchfulness and readiness for the Lord's coming" }
      ],
      topics: ["hope"]
    },
    {
      id: "m30",
      num: 330,
      prompt: "God told Israel, \"Be holy, for I am holy,\" and Peter repeats it to Christians. What does holiness mean across Scripture, and how is it different from simply being good?",
      passage: ["1 Peter 1:13-25"],
      inspiration: ["Leviticus 19:1-2", "Isaiah 6:1-7", "Hebrews 12:10-14"],
      readings: [
        { who: "J.C. Ryle", work: "Holiness" },
        { who: "John Wesley", work: "A Plain Account of Christian Perfection" }
      ],
      fathers: [
        { who: "Cyprian of Carthage", work: "On the Lord's Prayer (Treatise 4)", where: "Section 12", url: "https://www.newadvent.org/fathers/050704.htm", about: "On 'Hallowed be thy name' and daily sanctification; cites 'Be holy'" },
        { who: "Clement of Rome", work: "First Epistle to the Corinthians (1 Clement)", where: "Chapter 30", url: "https://www.newadvent.org/fathers/1010.htm", about: "As the portion of the Holy One, do all that pertains to holiness" }
      ],
      topics: ["life", "god"]
    }
  ],

  philosopher: [
    {
      id: "p1",
      num: 533,
      prompt: "If God knows everything that will happen, are human choices truly free? How have Christians tried to hold divine foreknowledge and human freedom together?",
      passage: ["Romans 8:28-30", "Acts 2:23"],
      inspiration: ["Romans 9:14-24", "Philippians 2:12-13", "Deuteronomy 30:19"],
      readings: [
        { who: "Augustine", work: "On Free Choice of the Will" },
        { who: "Boethius", work: "The Consolation of Philosophy, Book 5" },
        { who: "Luis de Molina", work: "On Divine Foreknowledge (Part IV of the Concordia)" },
        { who: "Jonathan Edwards", work: "Freedom of the Will" }
      ],
      fathers: [
        { who: "Origen", work: "Against Celsus", where: "Book 2, ch. 20", url: "https://www.newadvent.org/fathers/04162.htm", about: "Whether God's foreknowledge of Judas's betrayal causes it; foreknowledge versus necessity" },
        { who: "Augustine", work: "City of God", where: "Book 5, chs. 9–10", url: "https://www.newadvent.org/fathers/120105.htm", about: "Answers Cicero's claim that divine foreknowledge rules out free will" },
        { who: "Justin Martyr", work: "First Apology", where: "ch. 43", url: "https://www.newadvent.org/fathers/0126.htm", about: "Prophecy and foreknowledge set alongside human responsibility and free choice" }
      ],
      topics: ["god"]
    },
    {
      id: "p2",
      num: 109,
      prompt: "If God is all-good and all-powerful, why is there evil? Is evil a \"thing\" God created, or something else?",
      passage: ["Genesis 50:20", "Romans 8:18-23"],
      inspiration: ["Job 38:1-11", "Genesis 1:31", "Revelation 21:4"],
      readings: [
        { who: "Augustine", work: "Enchiridion, chs. 10–14" },
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part I, Questions 48–49" },
        { who: "Alvin Plantinga", work: "God, Freedom, and Evil" }
      ],
      fathers: [
        { who: "Athanasius", work: "Against the Heathen", where: "chs. 6–7", url: "https://www.newadvent.org/fathers/2801.htm", about: "Rejects evil as a substance; locates its origin in the soul's perverted choice" },
        { who: "Gregory of Nyssa", work: "The Great Catechism", where: "chs. 5–6", url: "https://www.newadvent.org/fathers/2908.htm", about: "Evil arising from free will, described as absence of good rather than a thing" },
        { who: "Augustine", work: "Confessions", where: "Book 7, chs. 12–16", url: "https://www.newadvent.org/fathers/110107.htm", about: "His search for where evil comes from; evil not a substance but perverted will" }
      ],
      topics: ["sin", "god"]
    },
    {
      id: "p3",
      num: 856,
      prompt: "How can God be one and yet three persons without contradiction? What would be lost if we said God is only one person, or three separate gods?",
      passage: ["Deuteronomy 6:4", "Matthew 28:19"],
      inspiration: ["John 1:1", "John 10:30", "2 Corinthians 13:14"],
      readings: [
        { who: "Gregory of Nazianzus", work: "Theological Orations (Orations 27–31)" },
        { who: "Augustine", work: "On the Trinity" },
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part I, Questions 27–43" }
      ],
      fathers: [
        { who: "Gregory of Nyssa", work: "On \"Not Three Gods\" (to Ablabius)", where: "", url: "https://www.newadvent.org/fathers/2905.htm", about: "Why three divine Persons sharing one nature are not called three Gods" },
        { who: "Basil of Caesarea", work: "Letter 38 (to his brother Gregory)", where: "", url: "https://www.newadvent.org/fathers/3202038.htm", about: "Distinguishes ousia (common essence) from hypostasis (Person) in the Trinity" },
        { who: "Tertullian", work: "Against Praxeas", where: "chs. 2–3", url: "https://www.newadvent.org/fathers/0317.htm", about: "Against modalism: one God in three Persons without destroying the divine monarchy" }
      ],
      topics: ["god"]
    },
    {
      id: "p4",
      num: 832,
      prompt: "Scripture says God does not change, yet it also describes God grieving and relenting. Does God change, or suffer? What is at stake either way?",
      passage: ["Malachi 3:6", "Genesis 6:5-6", "Hosea 11:8-9"],
      inspiration: ["James 1:17", "Numbers 23:19", "Exodus 32:9-14"],
      readings: [
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part I, Question 9" },
        { who: "Thomas Weinandy", work: "Does God Suffer?" },
        { who: "Jürgen Moltmann", work: "The Crucified God" }
      ],
      fathers: [
        { who: "Augustine", work: "City of God", where: "Book 15, ch. 25", url: "https://www.ccel.org/ccel/schaff/npnf102.iv.XV.25.html", about: "How Scripture's language of God's anger and repenting fits an unchanging God" },
        { who: "Novatian", work: "On the Trinity", where: "ch. 5", url: "https://www.newadvent.org/fathers/0511.htm", about: "How to read God's anger and hatred in Scripture without ascribing human vices" },
        { who: "Lactantius", work: "On the Anger of God", where: "", url: "https://www.newadvent.org/fathers/0703.htm", about: "Argues against philosophers that God is truly angry with wickedness" }
      ],
      topics: ["god"]
    },
    {
      id: "p5",
      num: 226,
      prompt: "The Council of Chalcedon (451) said Christ is one person in two natures, fully God and fully man. Why did the early church insist on both, and what goes wrong if you lose either one?",
      passage: ["John 1:14", "Philippians 2:5-11"],
      inspiration: ["Hebrews 4:15", "Colossians 2:9", "Hebrews 2:14-18"],
      readings: [
        { who: "Leo the Great", work: "The Tome of Leo" },
        { who: "Cyril of Alexandria", work: "On the Unity of Christ" },
        { who: "Council of Chalcedon", work: "The Chalcedonian Definition (451)" }
      ],
      fathers: [
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 3, ch. 18", url: "https://www.newadvent.org/fathers/0103318.htm", about: "Why the Mediator had to be both truly God and truly man to save" },
        { who: "Gregory of Nazianzus", work: "Letter 101 (to Cledonius)", where: "", url: "https://www.newadvent.org/fathers/3103a.htm", about: "Against Apollinarius: Christ assumed a full human mind; the unassumed is unhealed" },
        { who: "Athanasius", work: "Letter 59 (to Epictetus)", where: "", url: "https://www.newadvent.org/fathers/2806059.htm", about: "Defends the true humanity of Christ's body from Mary, not changed into Godhead" }
      ],
      topics: ["christ"]
    },
    {
      id: "p6",
      num: 126,
      prompt: "When Jesus said \"This is my body,\" what did he mean? How do Catholic, Orthodox, Lutheran, and Reformed Christians understand Christ's presence in the Lord's Supper, and why does it matter?",
      passage: ["Matthew 26:26-28", "John 6:51-58"],
      inspiration: ["1 Corinthians 10:16-17", "1 Corinthians 11:23-29"],
      readings: [
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part III, Questions 73–83" },
        { who: "John of Damascus", work: "An Exact Exposition of the Orthodox Faith, Book 4, ch. 13" },
        { who: "Martin Luther", work: "The Babylonian Captivity of the Church" },
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 4, ch. 17" }
      ],
      fathers: [
        { who: "Justin Martyr", work: "First Apology", where: "ch. 66", url: "https://www.ccel.org/ccel/schaff/anf01.viii.ii.lxvi.html", about: "Early description of the Eucharist received as Christ's flesh and blood" },
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 22 (Mystagogical 4)", where: "", url: "https://www.newadvent.org/fathers/310122.htm", about: "Teaching new believers that the bread and wine are Christ's body and blood" },
        { who: "Augustine", work: "Tractates on the Gospel of John", where: "Tractate 26", url: "https://www.newadvent.org/fathers/1701026.htm", about: "On John 6: the sacrament versus its virtue; eating Christ's flesh by faith" }
      ],
      topics: ["church"]
    },
    {
      id: "p7",
      num: 870,
      prompt: "God is infinite and our words are finite. When we call God \"good\" or \"wise,\" do those words mean the same thing they mean for us, something completely different, or something in between?",
      passage: ["Isaiah 55:8-9", "Exodus 3:14"],
      inspiration: ["Romans 11:33-36", "1 Timothy 6:16", "Psalm 145:3"],
      readings: [
        { who: "Pseudo-Dionysius", work: "The Divine Names and The Mystical Theology" },
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part I, Question 13" }
      ],
      fathers: [
        { who: "Basil of Caesarea", work: "Letter 234", where: "", url: "https://www.newadvent.org/fathers/3202234.htm", about: "Whether we know God's essence or know him through his operations" },
        { who: "Augustine", work: "On Christian Doctrine", where: "Book 1, chs. 6–7", url: "https://www.newadvent.org/fathers/12021.htm", about: "In what sense God is unspeakable, yet still rightly spoken of" },
        { who: "John of Damascus", work: "An Exact Exposition of the Orthodox Faith", where: "Book 1, ch. 4", url: "https://www.newadvent.org/fathers/33041.htm", about: "That the divine nature is incomprehensible; what our names for God signify" }
      ],
      topics: ["god", "scripture"]
    },
    {
      id: "p8",
      num: 998,
      prompt: "Does faith go beyond reason, against reason, or depend on reason? Can we reason our way to God, or only understand after we believe?",
      passage: ["1 Corinthians 1:18-25", "Acts 17:22-31"],
      inspiration: ["1 Peter 3:15", "Hebrews 11:1-3", "Isaiah 1:18"],
      readings: [
        { who: "Anselm of Canterbury", work: "Proslogion" },
        { who: "Thomas Aquinas", work: "Summa Contra Gentiles, Book 1, chs. 3–8" },
        { who: "Blaise Pascal", work: "Pensées" },
        { who: "Søren Kierkegaard", work: "Fear and Trembling" }
      ],
      fathers: [
        { who: "Augustine", work: "Tractates on the Gospel of John", where: "Tractate 29", url: "https://www.newadvent.org/fathers/1701029.htm", about: "On John 7:17 and Isaiah 7:9: believing in order to understand" },
        { who: "Tertullian", work: "The Prescription Against Heretics", where: "ch. 7", url: "https://www.newadvent.org/fathers/0311.htm", about: "\"What has Athens to do with Jerusalem?\": suspicion of philosophy as a source of heresy" },
        { who: "Clement of Alexandria", work: "Stromata", where: "Book 1, ch. 5", url: "https://www.newadvent.org/fathers/02101.htm", about: "Philosophy as a preparation leading the Greeks toward Christ" }
      ],
      topics: ["scripture"]
    },
    {
      id: "p9",
      num: 637,
      prompt: "Why did God become man, and how exactly does Christ's death save us? Compare the idea of Christ paying a debt of honor, Christ as a substitute bearing punishment, and Christ as victor over sin, death, and the devil.",
      passage: ["Romans 3:23-26", "Colossians 2:13-15"],
      inspiration: ["Mark 10:45", "Hebrews 2:14-15", "Isaiah 53:4-6"],
      readings: [
        { who: "Anselm of Canterbury", work: "Why God Became Man (Cur Deus Homo)" },
        { who: "Gustaf Aulén", work: "Christus Victor" },
        { who: "Athanasius", work: "On the Incarnation" }
      ],
      fathers: [
        { who: "Gregory of Nyssa", work: "The Great Catechism", where: "chs. 21–26", url: "https://www.newadvent.org/fathers/2908.htm", about: "The ransom given for humanity and the outwitting of the devil" },
        { who: "Gregory of Nazianzus", work: "Oration 45 (Second Oration on Easter)", where: "sec. 22", url: "https://www.newadvent.org/fathers/310245.htm", about: "Asks to whom Christ's blood was paid, rejecting both devil and Father as payee" },
        { who: "Augustine", work: "Reply to Faustus the Manichaean", where: "Book 14", url: "https://www.newadvent.org/fathers/140614.htm", about: "Christ bearing the curse and our punishment though himself without guilt" }
      ],
      topics: ["christ", "salvation"]
    },
    {
      id: "p10",
      num: 235,
      prompt: "Is God outside of time altogether, or does God exist through all time without beginning or end? How would each view change the way we understand prayer and God's knowledge?",
      passage: ["Psalm 90:2-4", "2 Peter 3:8"],
      inspiration: ["Revelation 1:8", "Isaiah 57:15", "John 8:58"],
      readings: [
        { who: "Augustine", work: "Confessions, Book 11" },
        { who: "Boethius", work: "The Consolation of Philosophy, Book 5" }
      ],
      fathers: [
        { who: "Augustine", work: "City of God", where: "Book 11, chs. 6 and 21", url: "https://www.newadvent.org/fathers/120111.htm", about: "World and time begun together; God's eternal, unchanging knowledge and will" },
        { who: "John of Damascus", work: "An Exact Exposition of the Orthodox Faith", where: "Book 2, ch. 1", url: "https://www.newadvent.org/fathers/33042.htm", about: "On aeon/age and time, and God as existing before and making the ages" }
      ],
      topics: ["god"]
    },
    {
      id: "p11",
      num: 906,
      prompt: "Does God choose who will be saved because he foresees their faith, or does faith itself flow from God's choice? What is at stake for how we see God's grace and human responsibility?",
      passage: ["Ephesians 1:3-14"],
      inspiration: ["Romans 8:29-30", "John 6:37-44", "1 Timothy 2:3-6", "2 Peter 3:9"],
      readings: [
        { who: "Augustine", work: "On the Predestination of the Saints" },
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 3, chs. 21–24" },
        { who: "Jacobus Arminius", work: "Declaration of Sentiments" }
      ],
      fathers: [
        { who: "Origen", work: "On First Principles (De Principiis)", where: "Book 3, ch. 1", url: "https://www.newadvent.org/fathers/04123.htm", about: "Defends free will; reads Pharaoh's hardening and Romans 9's potter and vessels" },
        { who: "John Chrysostom", work: "Homilies on Romans", where: "Homily 15 (Rom 8:28–39)", url: "https://www.newadvent.org/fathers/210215.htm", about: "\"Called according to his purpose\": calling, foreknowledge, and the hearer's response" },
        { who: "John Cassian", work: "Conferences", where: "Conference 13 (Abbot Chaeremon), chs. 8–18", url: "https://www.newadvent.org/fathers/350813.htm", about: "Whether God's grace precedes or follows the beginning of a good will" }
      ],
      topics: ["salvation", "god"]
    },
    {
      id: "p12",
      num: 563,
      prompt: "Can a true believer fall away and be lost? How do Christians read the warnings of this passage alongside the promises that no one can snatch Christ's sheep from his hand?",
      passage: ["Hebrews 6:4-8"],
      inspiration: ["Hebrews 10:26-31", "John 10:27-29", "Romans 8:35-39", "Philippians 1:6"],
      readings: [
        { who: "Westminster Assembly", work: "Westminster Confession of Faith, ch. 17 (Of the Perseverance of the Saints)" },
        { who: "Council of Trent", work: "Session 6, Decree on Justification, chs. 13–15" },
        { who: "Jacobus Arminius", work: "Declaration of Sentiments" }
      ],
      fathers: [
        { who: "Augustine", work: "On Rebuke and Grace", where: "chs. 10–16, 20", url: "https://www.newadvent.org/fathers/1513.htm", about: "Perseverance as God's gift; those who fall away versus the elect" },
        { who: "John Chrysostom", work: "Homilies on Hebrews", where: "Homily 9 (Heb 6:1–6)", url: "https://www.newadvent.org/fathers/240209.htm", about: "Reads Hebrews 6:4–6 as ruling out a second baptism, not repentance" }
      ],
      topics: ["salvation"]
    },
    {
      id: "p13",
      num: 627,
      prompt: "What is hell? Is it unending conscious punishment, the final destruction of the wicked, or something else? What does each view say about God's justice and love?",
      passage: ["Matthew 25:31-46"],
      inspiration: ["Mark 9:43-48", "2 Thessalonians 1:5-10", "Revelation 20:10-15", "Romans 6:23"],
      readings: [
        { who: "Augustine", work: "City of God, Book 21" },
        { who: "C.S. Lewis", work: "The Problem of Pain, ch. 8" },
        { who: "David L. Edwards and John Stott", work: "Evangelical Essentials" }
      ],
      fathers: [
        { who: "Justin Martyr", work: "First Apology", where: "ch. 8", url: "https://www.ccel.org/ccel/schaff/anf01.viii.ii.viii.html", about: "Everlasting punishment of the wicked, contrasted with Plato's thousand-year period" },
        { who: "Arnobius", work: "Against the Heathen", where: "Book 2, ch. 14", url: "https://www.newadvent.org/fathers/06312.htm", about: "Souls not immortal by nature; the wicked pass into final destruction" },
        { who: "Gregory of Nyssa", work: "The Great Catechism", where: "ch. 26", url: "https://www.newadvent.org/fathers/2908.htm", about: "Hope that evil is finally purged, even from the adversary himself" }
      ],
      topics: ["hope", "god"]
    },
    {
      id: "p14",
      num: 133,
      prompt: "Scripture is both God's word and written by human authors. How can it be fully both, and what does that mean for how we handle hard passages and apparent contradictions?",
      passage: ["2 Timothy 3:14-17", "2 Peter 1:19-21"],
      inspiration: ["Luke 1:1-4", "2 Peter 3:15-16", "John 10:35"],
      readings: [
        { who: "Augustine", work: "Letter 82 (to Jerome)" },
        { who: "Second Vatican Council", work: "Dei Verbum (Dogmatic Constitution on Divine Revelation)" },
        { who: "B.B. Warfield", work: "Revelation and Inspiration" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homilies on Matthew", where: "Homily 1, secs. 5–6", url: "https://www.newadvent.org/fathers/200101.htm", about: "Why four Gospels, and how minor differences between them attest their truth" },
        { who: "Origen", work: "On First Principles (De Principiis)", where: "Book 4", url: "https://www.newadvent.org/fathers/04124.htm", about: "Inspiration of Scripture and the purpose of its difficulties and impossibilities" }
      ],
      topics: ["scripture"]
    },
    {
      id: "p15",
      num: 285,
      prompt: "Is Scripture the only infallible rule for the church, or do Scripture and Tradition together carry authority? How do Protestants, Catholics, and Orthodox answer, and why?",
      passage: ["2 Thessalonians 2:13-15"],
      inspiration: ["Mark 7:6-13", "Acts 15:22-29", "1 Timothy 3:15", "2 Timothy 3:16-17"],
      readings: [
        { who: "Irenaeus of Lyons", work: "Against Heresies, Book 3" },
        { who: "Vincent of Lérins", work: "The Commonitory" },
        { who: "Basil of Caesarea", work: "On the Holy Spirit, ch. 27" },
        { who: "Westminster Assembly", work: "Westminster Confession of Faith, ch. 1 (Of the Holy Scripture)" },
        { who: "Second Vatican Council", work: "Dei Verbum (Dogmatic Constitution on Divine Revelation)" }
      ],
      fathers: [
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 4", where: "sec. 17", url: "https://www.newadvent.org/fathers/310104.htm", about: "Tells hearers to accept his teaching only with proof from the Scriptures" },
        { who: "Tertullian", work: "The Prescription Against Heretics", where: "chs. 19–21", url: "https://www.newadvent.org/fathers/0311.htm", about: "Rule of faith and apostolic churches as the test, rather than arguing from Scripture alone" },
        { who: "Athanasius", work: "Letter 39 (Festal Letter, AD 367)", where: "", url: "https://www.newadvent.org/fathers/2806039.htm", about: "Lists the canonical books as sufficient \"fountains of salvation\"" }
      ],
      topics: ["scripture", "church"]
    },
    {
      id: "p16",
      num: 419,
      prompt: "Should baptism be given to the infants of believers, or only to people who profess faith themselves? What does each view believe baptism is?",
      passage: ["Acts 2:37-41"],
      inspiration: ["Acts 16:30-34", "Colossians 2:11-12", "Mark 10:13-16", "Genesis 17:9-14"],
      readings: [
        { who: "Tertullian", work: "On Baptism, ch. 18" },
        { who: "Martin Luther", work: "Large Catechism, Part 4 (Baptism)" },
        { who: "Westminster Assembly", work: "Westminster Confession of Faith, ch. 28 (Of Baptism)" },
        { who: "Particular Baptists", work: "Second London Baptist Confession (1689), ch. 29 (Of Baptism)" }
      ],
      fathers: [
        { who: "Cyprian of Carthage", work: "Letter 58 (to Fidus)", where: "", url: "https://www.newadvent.org/fathers/050658.htm", about: "African bishops reject waiting until the eighth day to baptize infants" },
        { who: "Gregory of Nazianzus", work: "Oration 40 (On Holy Baptism)", where: "sec. 28", url: "https://www.newadvent.org/fathers/310240.htm", about: "Whether to baptize infants: at once if in danger, otherwise around age three" },
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 2, ch. 22, sec. 4", url: "https://www.newadvent.org/fathers/0103222.htm", about: "Christ came to save all ages born again to God, infants included" }
      ],
      topics: ["church"]
    },
    {
      id: "p17",
      num: 180,
      prompt: "Is it right to use images of Christ and the saints in worship? How did the church settle the iconoclast controversy, and why do many Protestants still disagree?",
      passage: ["Exodus 20:4-6"],
      inspiration: ["Exodus 25:18-22", "Numbers 21:8-9", "2 Kings 18:4", "Colossians 1:15"],
      readings: [
        { who: "John of Damascus", work: "Apologies Against Those Who Decry Holy Images" },
        { who: "Second Council of Nicaea", work: "Decree of the Second Council of Nicaea (787)" },
        { who: "Reformed Churches", work: "Heidelberg Catechism, Q&A 96–98" },
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 1, ch. 11" }
      ],
      fathers: [
        { who: "Epiphanius of Salamis", work: "Letter to John of Jerusalem (Jerome, Letter 51)", where: "sec. 9", url: "https://www.newadvent.org/fathers/3001051.htm", about: "Tears down a church curtain bearing an image of Christ or a saint" },
        { who: "Basil of Caesarea", work: "On the Holy Spirit", where: "ch. 18, sec. 45", url: "https://www.ccel.org/ccel/schaff/npnf208.vii.xix.html", about: "Honor paid to an image passes to its prototype (a Trinitarian argument later cited for icons)" },
        { who: "Gregory the Great", work: "Letter to Serenus of Marseilles", where: "Book 11, Letter 13", url: "https://www.newadvent.org/fathers/360211013.htm", about: "Rebukes a bishop for smashing images: pictures teach the unlettered, not to be adored" }
      ],
      topics: ["church"]
    },
    {
      id: "p18",
      num: 529,
      prompt: "Why did the Council of Ephesus (431) call Mary \"Theotokos,\" the God-bearer? Is that title mainly a claim about Mary, or about Christ?",
      passage: ["Luke 1:26-45"],
      inspiration: ["Galatians 4:4-5", "John 1:14", "Matthew 1:18-23"],
      readings: [
        { who: "Cyril of Alexandria", work: "Third Letter to Nestorius" },
        { who: "Cyril of Alexandria", work: "On the Unity of Christ" }
      ],
      fathers: [
        { who: "John Cassian", work: "On the Incarnation of the Lord, Against Nestorius", where: "Book 2, ch. 2", url: "https://orthodoxchurchfathers.com/fathers/npnf211/npnf2189.html", about: "Argues Mary is Theotokos, not only Christotokos, because Christ is truly God" },
        { who: "Athanasius", work: "Discourses Against the Arians", where: "Discourse 3, sec. 29", url: "https://www.newadvent.org/fathers/28163.htm", about: "Calls Mary \"Bearer of God\" when summarizing the Word taking flesh" },
        { who: "Gregory of Nazianzus", work: "Letter 101 (to Cledonius)", where: "", url: "https://www.newadvent.org/fathers/3103a.htm", about: "Makes confessing Mary as Mother of God a test of true faith in Christ" }
      ],
      topics: ["christ"]
    },
    {
      id: "p19",
      num: 332,
      prompt: "Are miracles violations of the laws of nature? How have Christians answered skeptics of miracles, and what do miracles reveal about God and the world?",
      passage: ["John 20:30-31"],
      inspiration: ["John 2:1-11", "Acts 2:22", "1 Corinthians 15:14-17", "Colossians 1:16-17"],
      readings: [
        { who: "Augustine", work: "City of God, Book 21, chs. 5–8" },
        { who: "Thomas Aquinas", work: "Summa Contra Gentiles, Book 3, chs. 98–103" },
        { who: "C.S. Lewis", work: "Miracles" }
      ],
      fathers: [
        { who: "Augustine", work: "Tractates on the Gospel of John", where: "Tractate 24, sec. 1", url: "https://www.newadvent.org/fathers/1701024.htm", about: "Daily governance of the world as a greater wonder than miracles, which are rare" },
        { who: "Augustine", work: "Reply to Faustus the Manichaean", where: "Book 26, sec. 3", url: "https://www.newadvent.org/fathers/140626.htm", about: "Miracles are not against nature, only against nature as known to us" },
        { who: "Origen", work: "Against Celsus", where: "Book 2, ch. 48", url: "https://www.ccel.org/ccel/schaff/anf04.vi.ix.ii.xlviii.html", about: "Answers Celsus's charge that Jesus' miracles were sorcery" }
      ],
      topics: ["god", "scripture"]
    },
    {
      id: "p20",
      num: 372,
      prompt: "Paul says Gentiles who never had the Law still show its work written on their hearts. Is there a moral law everyone can know, and how much can people know about God without the Bible?",
      passage: ["Romans 1:18-32", "Romans 2:12-16"],
      inspiration: ["Psalm 19:1-4", "Acts 14:15-17", "Acts 17:24-28"],
      readings: [
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part I-II, Question 94" },
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 1, chs. 3–5" },
        { who: "C.S. Lewis", work: "Mere Christianity, Book 1" },
        { who: "Emil Brunner and Karl Barth", work: "Natural Theology (Nature and Grace / No!)" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homilies on the Statues", where: "Homily 12, secs. 9–14", url: "https://www.newadvent.org/fathers/190112.htm", about: "Natural law and conscience implanted in all; Romans 2:14–15" },
        { who: "Justin Martyr", work: "Second Apology", where: "ch. 13", url: "https://www.newadvent.org/fathers/0127.htm", about: "The seed of the Word in all people; truth found among pagans belongs to Christians" }
      ],
      topics: ["scripture", "creation"]
    },
    {
      id: "p21",
      num: 997,
      prompt: "What did we inherit from Adam: his guilt, or the death and corruption his sin brought into human nature? How do Augustine and the Eastern Orthodox tradition differ on \"original sin,\" and why did the church reject the idea that we inherit nothing at all?",
      passage: ["Romans 5:12-19"],
      inspiration: ["Psalm 51:5", "Ephesians 2:1-3", "Ezekiel 18:20", "1 Corinthians 15:22"],
      readings: [
        { who: "Augustine", work: "On the Merits and Forgiveness of Sins, and on the Baptism of Infants" },
        { who: "Council of Trent", work: "Session 5, Decree on Original Sin" },
        { who: "Timothy (Kallistos) Ware", work: "The Orthodox Church" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homilies on Romans", where: "Homily 10 (Rom 5:12–6:2)", url: "https://www.newadvent.org/fathers/210210.htm", about: "What \"made sinners\" through Adam means: liable to punishment and death" },
        { who: "Cyprian of Carthage", work: "Letter 58 (to Fidus)", where: "sec. 5", url: "https://www.newadvent.org/fathers/050658.htm", about: "Infants contract the contagion of the ancient death from Adam at birth" }
      ],
      topics: ["sin"]
    },
    {
      id: "p22",
      num: 187,
      prompt: "Can a Christian become free of willful sin in this life, or will believers struggle until death? Who is the \"wretched man\" in this passage: Paul as a Christian, Paul before Christ, or someone else?",
      passage: ["Romans 7:14-25"],
      inspiration: ["1 John 1:8-10", "1 John 3:6-9", "Matthew 5:48", "Philippians 3:12-15"],
      readings: [
        { who: "Augustine", work: "Against Two Letters of the Pelagians, Book 1" },
        { who: "John Wesley", work: "A Plain Account of Christian Perfection" },
        { who: "John Owen", work: "Of the Mortification of Sin in Believers" }
      ],
      fathers: [
        { who: "John Chrysostom", work: "Homilies on Romans", where: "Homily 13 (Rom 7:14–8:11)", url: "https://www.newadvent.org/fathers/210213.htm", about: "Reads Romans 7 as the person under the law before grace" },
        { who: "Augustine", work: "On Man's Perfection in Righteousness", where: "", url: "https://www.newadvent.org/fathers/1504.htm", about: "Answers Caelestius on whether a person can live without sin in this life" }
      ],
      topics: ["life", "sin"]
    },
    {
      id: "p23",
      num: 321,
      prompt: "If God already knows what we need and has already decided what he will do, why pray? Can prayer change anything?",
      passage: ["James 5:13-18"],
      inspiration: ["Matthew 6:7-8", "Luke 18:1-8", "Genesis 18:22-33", "Exodus 32:9-14"],
      readings: [
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part II-II, Question 83" },
        { who: "Blaise Pascal", work: "Pensées" },
        { who: "Tertullian", work: "On Prayer" }
      ],
      fathers: [
        { who: "Augustine", work: "Letter 130 (to Proba)", where: "ch. 8", url: "https://www.newadvent.org/fathers/1102130.htm", about: "Why ask if God already knows our needs; prayer enlarging our desire" },
        { who: "Origen", work: "On Prayer", where: "secs. 3–4 (Curtis translation)", url: "https://www.tertullian.org/fathers/origen_on_prayer_02_text.htm", about: "Objection that prayer is superfluous given foreknowledge; his reply" },
        { who: "Gregory the Great", work: "Dialogues", where: "Book 1, ch. 8", url: "https://www.tertullian.org/fathers/gregory_01_dialogues_book1.htm", about: "Whether prayer can obtain what is predestined" }
      ],
      topics: ["life", "god"]
    },
    {
      id: "p24",
      num: 168,
      prompt: "Classical theologians taught that God is \"simple\": without parts, so that his goodness, wisdom, and being are all one. Why did they insist on this, and why have some modern thinkers questioned it?",
      passage: ["Exodus 3:13-15", "1 John 4:8"],
      inspiration: ["Deuteronomy 6:4", "James 1:17", "1 John 1:5"],
      readings: [
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part I, Question 3" },
        { who: "Anselm of Canterbury", work: "Proslogion, chs. 18–22" },
        { who: "Alvin Plantinga", work: "Does God Have a Nature?" }
      ],
      fathers: [
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 2, ch. 13, sec. 3", url: "https://www.newadvent.org/fathers/0103213.htm", about: "God as simple and uncompounded, wholly mind, without parts" },
        { who: "Augustine", work: "City of God", where: "Book 11, ch. 10", url: "https://www.newadvent.org/fathers/120111.htm", about: "The simple Trinity, in whom substance and quality are identical" },
        { who: "John of Damascus", work: "An Exact Exposition of the Orthodox Faith", where: "Book 1, ch. 9", url: "https://www.newadvent.org/fathers/33041.htm", about: "What our affirmations about God signify, given that he is simple" }
      ],
      topics: ["god"]
    },
    {
      id: "p25",
      num: 460,
      prompt: "Can a Christian fight in a war? How have some Christians drawn on Scripture to defend \"just war,\" and others to defend nonviolence?",
      passage: ["Matthew 5:38-48", "Romans 13:1-7"],
      inspiration: ["Romans 12:17-21", "Luke 3:14", "Matthew 26:51-52"],
      readings: [
        { who: "Augustine", work: "City of God, Book 19, ch. 7" },
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part II-II, Question 40" },
        { who: "Stanley Hauerwas", work: "The Peaceable Kingdom" }
      ],
      fathers: [
        { who: "Tertullian", work: "The Chaplet (De Corona)", where: "ch. 11", url: "https://www.newadvent.org/fathers/0304.htm", about: "Whether military service is lawful for Christians at all" },
        { who: "Origen", work: "Against Celsus", where: "Book 8, ch. 73", url: "https://www.ccel.org/ccel/schaff/anf04.vi.ix.viii.lxxiii.html", about: "Answers the demand that Christians fight: they aid rulers by prayer" },
        { who: "Augustine", work: "Letter 189 (to Boniface)", where: "secs. 4–6", url: "https://www.newadvent.org/fathers/1102189.htm", about: "Counsels a Christian soldier; war waged for the sake of peace" }
      ],
      topics: ["life"]
    },
    {
      id: "p26",
      num: 958,
      prompt: "The apostles proclaimed that salvation is found in no one but Christ. What then of people who never hear the gospel? How have Christians answered, and what is at stake?",
      passage: ["Acts 4:12"],
      inspiration: ["John 14:6", "Romans 10:13-17", "Acts 10:34-35", "1 Timothy 2:3-6"],
      readings: [
        { who: "Catholic Church", work: "Catechism of the Catholic Church, paragraphs 846–848" },
        { who: "Westminster Assembly", work: "Westminster Confession of Faith, ch. 10 (Of Effectual Calling)" },
        { who: "C.S. Lewis", work: "Mere Christianity, Book 2, ch. 5" }
      ],
      fathers: [
        { who: "Justin Martyr", work: "First Apology", where: "ch. 46", url: "https://www.ccel.org/ccel/schaff/anf01.viii.ii.xlvi.html", about: "Those before Christ who lived by the Word (Logos)" },
        { who: "Augustine", work: "Letter 102 (to Deogratias)", where: "Question 2, secs. 8–15", url: "https://www.newadvent.org/fathers/1102102.htm", about: "Porphyry's objection: what of people who lived before Christ came?" },
        { who: "Clement of Alexandria", work: "Stromata", where: "Book 6, ch. 6", url: "https://www.newadvent.org/fathers/02106.htm", about: "The gospel preached to Jews and Gentiles in Hades" }
      ],
      topics: ["salvation"]
    },
    {
      id: "p27",
      num: 504,
      prompt: "How should we read the days of creation? What have Christians, from the church fathers to the Reformers, made of how Genesis describes the making of the world?",
      passage: ["Genesis 1", "Genesis 2:1-4"],
      inspiration: ["Exodus 20:11", "Psalm 90:4", "Hebrews 11:3"],
      readings: [
        { who: "Basil of Caesarea", work: "Hexaemeron (Homilies on the Six Days of Creation)" },
        { who: "Augustine", work: "The Literal Meaning of Genesis" },
        { who: "John Calvin", work: "Commentary on Genesis" }
      ],
      fathers: [
        { who: "Augustine", work: "City of God", where: "Book 11, chs. 6–7", url: "https://www.newadvent.org/fathers/120111.htm", about: "What kind of days had morning and evening before the sun existed" },
        { who: "Origen", work: "On First Principles (De Principiis)", where: "Book 4, sec. 16", url: "https://www.newadvent.org/fathers/04124.htm", about: "Cites days without sun, moon, and stars as signs of a non-literal sense" },
        { who: "Theophilus of Antioch", work: "To Autolycus", where: "Book 2, chs. 11–12", url: "https://www.newadvent.org/fathers/02042.htm", about: "Recounts the six days' work and marvels at its greatness" }
      ],
      topics: ["creation", "scripture"]
    },
    {
      id: "p28",
      num: 540,
      prompt: "Are human beings souls who have bodies, or embodied creatures whose hope is resurrection? What happens to a person between death and the resurrection?",
      passage: ["2 Corinthians 5:1-10"],
      inspiration: ["Genesis 2:7", "Luke 23:42-43", "Philippians 1:21-24", "1 Corinthians 15:42-44"],
      readings: [
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part I, Questions 75–76" },
        { who: "Tertullian", work: "A Treatise on the Soul" },
        { who: "N.T. Wright", work: "Surprised by Hope" }
      ],
      fathers: [
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 5, ch. 31", url: "https://www.newadvent.org/fathers/0103531.htm", about: "Souls await the resurrection in an invisible place, not straight to heaven" },
        { who: "Athenagoras", work: "On the Resurrection of the Dead", where: "ch. 15", url: "https://www.newadvent.org/fathers/0206.htm", about: "Human nature as soul and body together, requiring resurrection" },
        { who: "Augustine", work: "Enchiridion", where: "ch. 109", url: "https://www.ccel.org/ccel/schaff/npnf103.iv.ii.cxi.html", about: "The state of the soul between death and the resurrection" }
      ],
      topics: ["creation", "hope"]
    },
    {
      id: "p29",
      num: 509,
      prompt: "The Creed confesses \"one, holy, catholic, and apostolic Church.\" What makes the church one, and why do Christians disagree about where that church is found?",
      passage: ["Ephesians 4:1-16"],
      inspiration: ["John 17:20-23", "Matthew 16:13-19", "1 Corinthians 1:10-13"],
      readings: [
        { who: "Cyprian of Carthage", work: "On the Unity of the Church" },
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 4, chs. 1–2" },
        { who: "Timothy (Kallistos) Ware", work: "The Orthodox Church" }
      ],
      fathers: [
        { who: "Ignatius of Antioch", work: "Letter to the Smyrnaeans", where: "ch. 8", url: "https://www.newadvent.org/fathers/0109.htm", about: "Unity around the bishop as the mark of the true Church and Eucharist" },
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 1, ch. 10, sec. 2", url: "https://www.newadvent.org/fathers/0103110.htm", about: "The scattered Church keeping one faith as if in one house" },
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 18", where: "secs. 23–26", url: "https://www.newadvent.org/fathers/310118.htm", about: "Why the Church is called catholic, and how to tell it from rival assemblies" }
      ],
      topics: ["church"]
    },
    {
      id: "p30",
      num: 110,
      prompt: "Isaiah calls God \"a God who hides himself.\" If God wants to be known, why isn't he more obvious? What might God's hiddenness be for?",
      passage: ["Isaiah 45:15-19"],
      inspiration: ["Psalm 13:1-2", "Romans 1:19-20", "Acts 17:26-27", "John 20:29"],
      readings: [
        { who: "Blaise Pascal", work: "Pensées" },
        { who: "Søren Kierkegaard", work: "Philosophical Fragments" }
      ],
      fathers: [
        { who: "Theophilus of Antioch", work: "To Autolycus", where: "Book 1, chs. 2–5", url: "https://www.newadvent.org/fathers/02041.htm", about: "\"Show me your God\": why God is unseen, and seen by the purified soul" },
        { who: "Minucius Felix", work: "Octavius", where: "ch. 18", url: "https://www.newadvent.org/fathers/0410.htm", about: "God beyond sight and comprehension, yet evident through creation's order" }
      ],
      topics: ["god", "scripture"]
    }
  ]
};

// Sources to explore from within each tradition.
// Shown on every question under "Go deeper in your tradition."
const TRADITIONS = {
  general: {
    label: "General / Non-denominational",
    sources: [
      "The Nicene Creed (381)",
      "C.S. Lewis, Mere Christianity",
      "John Stott, Basic Christianity"
    ]
  },
  catholic: {
    label: "Catholic",
    sources: [
      "Catechism of the Catholic Church",
      "Thomas Aquinas, Summa Theologiae"
    ]
  },
  orthodox: {
    label: "Eastern Orthodox",
    sources: [
      "Timothy (Kallistos) Ware, The Orthodox Church",
      "John of Damascus, An Exact Exposition of the Orthodox Faith"
    ]
  },
  anglican: {
    label: "Anglican / Episcopal",
    sources: [
      "The Thirty-Nine Articles",
      "The Book of Common Prayer",
      "Richard Hooker, Of the Laws of Ecclesiastical Polity"
    ]
  },
  lutheran: {
    label: "Lutheran",
    sources: [
      "The Book of Concord (including the Augsburg Confession)",
      "Martin Luther, Small and Large Catechisms"
    ]
  },
  reformed: {
    label: "Reformed / Presbyterian",
    sources: [
      "Westminster Confession of Faith and Catechisms",
      "Heidelberg Catechism",
      "John Calvin, Institutes of the Christian Religion"
    ]
  },
  methodist: {
    label: "Methodist / Wesleyan",
    sources: [
      "John Wesley, Sermons on Several Occasions",
      "The Methodist Articles of Religion"
    ]
  },
  baptist: {
    label: "Baptist",
    sources: [
      "Second London Baptist Confession (1689)",
      "The Baptist Faith and Message (2000)",
      "Charles Spurgeon's sermons"
    ]
  },
  pentecostal: {
    label: "Pentecostal / Charismatic (Trinitarian)",
    sources: [
      "Assemblies of God, Statement of Fundamental Truths",
      "Gordon Fee, God's Empowering Presence"
    ]
  }
};

// Translations offered in Settings, in display order.
//   id   = bible.com / YouVersion version number (each checked on a live bible.com page, 2026-09-30)
//   abbr = bible.com's abbreviation, used at the end of verse links
// Adding one here also requires adding its code to the database's allowed list
// (see supabase-migrations/002-more-translations.sql).
const TRANSLATION_INFO = [
  { code: "ESV",      name: "English Standard Version",         id: 59,   abbr: "ESV" },
  { code: "NIV",      name: "New International Version",        id: 111,  abbr: "NIV" },
  { code: "NLT",      name: "New Living Translation",           id: 116,  abbr: "NLT" },
  { code: "KJV",      name: "King James Version",               id: 1,    abbr: "KJV" },
  { code: "NKJV",     name: "New King James Version",           id: 114,  abbr: "NKJV" },
  { code: "CSB",      name: "Christian Standard Bible",         id: 1713, abbr: "CSB" },
  { code: "NASB",     name: "New American Standard Bible 2020", id: 2692, abbr: "NASB2020" },
  { code: "NASB1995", name: "New American Standard Bible 1995", id: 100,  abbr: "NASB1995" },
  { code: "LSB",      name: "Legacy Standard Bible",            id: 3345, abbr: "LSB" },
  { code: "AMP",      name: "Amplified Bible",                  id: 1588, abbr: "AMP" },
  { code: "NET",      name: "New English Translation",          id: 107,  abbr: "NET" },
  { code: "NRSVUE",   name: "New Revised Standard Version Updated Edition", id: 3523, abbr: "NRSVUE" },
  { code: "RSV",      name: "Revised Standard Version",         id: 2020, abbr: "RSV" },
  { code: "NABRE",    name: "New American Bible, Revised Edition", id: 463, abbr: "NABRE" },
  { code: "CEB",      name: "Common English Bible",             id: 37,   abbr: "CEB" },
  { code: "MSG",      name: "The Message",                      id: 97,   abbr: "MSG" },
  { code: "NIRV",     name: "New International Reader's Version", id: 110, abbr: "NIRV" },
  { code: "ASV",      name: "American Standard Version",        id: 12,   abbr: "ASV" }
];
const TRANSLATIONS = TRANSLATION_INFO.map((t) => t.code);
