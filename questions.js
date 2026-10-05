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
        { who: "John Chrysostom", work: "Homily 11 on the Gospel of John", where: "on John 1:14", url: "https://www.newadvent.org/fathers/240111.htm", about: "Homily on \"the Word was made flesh, and dwelt among us\"", summary: "Chrysostom explains that \"the Word became flesh\" does not mean God's essence changed into flesh; remaining what it was, it took the form of a servant.", quote: "So that when you hear that \"the Word became Flesh,\" be not disturbed nor cast down. For that Essence did not change to flesh, (it is impiety to imagine this,) but continuing what it is, It so took upon It the form of a servant.", anchor: "So that when you hear that", anchorEnd: "the form of a servant" },
        { who: "Augustine", work: "Tractate 1 on the Gospel of John", where: "on John 1:1–5", url: "https://www.newadvent.org/fathers/1701001.htm", about: "The eternal Word through whom all things were made", summary: "Augustine argues the Word cannot have been made, since God made all things through the Word; otherwise another Word would be needed to make it.", quote: "How can it be that the Word of God was made, when God by the Word made all things? If the Word of God was itself also made, by what other Word was it made?", anchor: "How can it be that the Word", anchorEnd: "what other Word was it made" }
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
        { who: "Gregory of Nyssa", work: "On the Making of Man", where: "ch. 5", url: "https://www.newadvent.org/fathers/2914.htm", about: "How human nature is a likeness of God", summary: "Gregory of Nyssa says God, like a painter, portrays his own beauty in us using virtues as colors, so that our nature shows his sovereignty.", quote: "so I would have you understand that our Maker also, painting the portrait to resemble His own beauty, by the addition of virtues, as it were with colors, shows in us His own sovereignty", anchor: "so I would have you understand that", anchorEnd: "shows in us His own sovereignty" },
        { who: "Athanasius", work: "On the Incarnation", where: "chs. 11–14", url: "https://www.newadvent.org/fathers/2802.htm", about: "Why only the Word could renew God's image in humanity", summary: "Athanasius says the Word, being the Father's own Image, came in person so that he could re-create humanity after that image.", quote: "Whence the Word of God came in His own person, that, as He was the Image of the Father, He might be able to create afresh the man after the image.", anchor: "Whence the Word of God came", anchorEnd: "create afresh the man after the image" }
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
        { who: "Cyril of Alexandria", work: "Commentary on Luke", where: "Sermon 107 (Luke 15:11–32)", url: "https://www.tertullian.org/fathers/cyril_on_luke_10_sermons_99_109.htm", about: "Sermon on the parable of the prodigal son", summary: "Cyril says God, like the father in the parable, rejoices when the lost are saved and restores them, clothing them in the robe and ring of freedom.", quote: "For He greatly rejoices when He sees those who were lost obtaining salvation, and raises them up again to that which they were in the beginning, giving them the dress of freedom, and adorning them with the chief robe, and putting a ring upon their hand, even the orderly behaviour which is pleasing to God and suitable to the free.", anchor: "For He greatly rejoices when He sees", anchorEnd: "suitable to the free" },
        { who: "Tertullian", work: "On Repentance", where: "ch. 8", url: "https://www.newadvent.org/fathers/0320.htm", about: "The prodigal's father as a picture of God receiving penitents", summary: "Tertullian identifies the prodigal's father with God, saying no one is so truly a Father or so rich in fatherly love.", quote: "Who is that father to be understood by us to be? God, surely: no one is so truly a Father; no one so rich in paternal love.", anchor: "Who is that father to be understood", anchorEnd: "so rich in paternal love" }
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
        { who: "Cyril of Alexandria", work: "Commentary on Luke", where: "Sermon 68 (Luke 10:25–37)", url: "https://www.tertullian.org/fathers/cyril_on_luke_07_sermons_66_80.htm", about: "Sermon on the lawyer's question and the Good Samaritan", summary: "Cyril tells the lawyer the parable proves that empty names and grand titles are worthless unless good deeds accompany them.", quote: "You have seen, O lawyer, and it has been proved by the parable, that it is of no avail whatsoever to any man, to be set up by empty names, and to pride himself upon unmeaning and ridiculous titles, so long as the excellence of deeds does not accompany them.", anchor: "and it has been proved by the parable", anchorEnd: "deeds does not accompany them" },
        { who: "Clement of Alexandria", work: "Who Is the Rich Man That Shall Be Saved?", where: "chs. 28–29", url: "https://www.newadvent.org/fathers/0207.htm", about: "The two great commandments and \"Who is my neighbor?\"", summary: "Clement notes that when asked who our neighbor is, Jesus did not limit it to relatives, fellow citizens, or co-religionists, but told of the pitied, despised Samaritan.", quote: "And on His interlocutor inquiring, 'Who is my neighbour?' He did not, in the same way with the Jews, specify the blood-relation, or the fellow-citizen, or the proselyte, or him that had been similarly circumcised, or the man who uses one and the same law.", anchor: "And on His interlocutor inquiring", anchorEnd: "one and the same law" }
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
        { who: "Clement of Rome", work: "First Epistle to the Corinthians (1 Clement)", where: "chs. 32–33", url: "https://www.newadvent.org/fathers/1010.htm", about: "Justified by faith, not our own works; yet keep doing good works", summary: "Clement says Christians are justified not by their own wisdom, piety, or works, but by the faith through which God has justified all people from the beginning.", quote: "And we, too, being called by His will in Christ Jesus, are not justified by ourselves, nor by our own wisdom, or understanding, or godliness, or works which we have wrought in holiness of heart; but by that faith through which, from the beginning, Almighty God has justified all men; to whom be glory for ever and ever.", anchor: "being called by His will in Christ Jesus", anchorEnd: "to whom be glory for ever and ever" },
        { who: "John Chrysostom", work: "Homily 4 on Ephesians", where: "on Eph. 2:1–10", url: "https://www.newadvent.org/fathers/230104.htm", about: "Homily on \"by grace you have been saved through faith\"", summary: "Chrysostom says even faith is not from ourselves, because we could not have believed unless Christ had come and called us.", quote: "Because had He not come, had He not called us, how had we been able to believe?", anchor: "Because had He not come", anchorEnd: "been able to believe" }
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
        { who: "Tertullian", work: "On Prayer", where: "chs. 1–9", url: "https://www.newadvent.org/fathers/0322.htm", about: "Clause-by-clause exposition of the Lord's Prayer", summary: "Tertullian says the Lord's Prayer covers not only worship of God and requests for ourselves but nearly all of Christ's teaching, so that it summarizes the whole Gospel.", quote: "For it has embraced not only the special duties of prayer, be it veneration of God or petition for man, but almost every discourse of the Lord, every record of His Discipline; so that, in fact, in the Prayer is comprised an epitome of the whole Gospel.", anchor: "For it has embraced not only the special", anchorEnd: "an epitome of the whole Gospel" },
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 23 (Mystagogical Lecture 5)", where: "sections 11–18", url: "https://www.newadvent.org/fathers/310123.htm", about: "Explaining each petition of the Our Father to the newly baptized", summary: "Cyril marvels that God has so fully forgiven rebels in deepest misery, and given such grace, that they may call him Father.", quote: "O most surpassing loving-kindness of God! On them who revolted from Him and were in the very extreme of misery has He bestowed such a complete forgiveness of evil deeds, and so great participation of grace, as that they should even call Him Father.", anchor: "On them who revolted from Him", anchorEnd: "should even call Him Father" },
        { who: "John Chrysostom", work: "Homily 19 on Matthew", where: "on Matt. 6:1–15", url: "https://www.newadvent.org/fathers/200119.htm", about: "Homily on secret prayer and the Lord's Prayer", summary: "Chrysostom says that calling God \"Father\" in the Lord's Prayer acknowledges all God's gifts, including forgiveness, righteousness, adoption, inheritance, brotherhood with the Son, and the Spirit.", quote: "For he who calls God Father, by him both remission of sins, and taking away of punishment, and righteousness, and sanctification, and redemption, and adoption, and inheritance, and brotherhood with the Only-Begotten, and the supply of the Spirit, are acknowledged in this single title.", anchor: "For he who calls God Father", anchorEnd: "acknowledged in this single title" }
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
        { who: "John Chrysostom", work: "Homily 60 on the Gospel of John", where: "on John 10:14–15 ff.", url: "https://www.newadvent.org/fathers/240160.htm", about: "Christ the Good Shepherd who knows his sheep and lays down his life", summary: "Chrysostom says the true shepherd differs from the hireling by always seeking the sheep's safety at the cost of his own.", quote: "For in this the shepherd differs from the hireling; the one always looks to his own safety, caring not for the sheep; the other always seeks that of the sheep, neglecting his own.", anchor: "For in this the shepherd differs from", anchorEnd: "neglecting his own" },
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 22 (Mystagogical Lecture 4)", where: "section 7", url: "https://www.newadvent.org/fathers/310122.htm", about: "Reads Psalm 23's prepared table as the Lord's Table", summary: "Cyril reads the psalm's prepared table as the mystical, spiritual Table God has set for his people in opposition to the evil spirits.", quote: "When the man says to God, You have prepared before me a table, what other does he indicate but that mystical and spiritual Table, which God has prepared for us over against, that is, contrary and in opposition to the evil spirits?", anchor: "When the man says to God", anchorEnd: "opposition to the evil spirits" }
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
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 13", where: "esp. sections 1–3, 34", url: "https://www.newadvent.org/fathers/310113.htm", about: "Lecture on \"crucified and buried,\" drawing on Isaiah 53", summary: "Cyril says the Cross brought the ignorant into light, freed those bound by sin, and ransomed the whole human race.", quote: "But the glory of the Cross led those who were blind through ignorance into light, loosed all who were held fast by sin, and ransomed the whole world of mankind.", anchor: "But the glory of the Cross led", anchorEnd: "the whole world of mankind" },
        { who: "John Chrysostom", work: "Homily 38 on First Corinthians", where: "on 1 Cor. 15:1–11", url: "https://www.newadvent.org/fathers/220138.htm", about: "Homily on \"Christ died for our sins according to the Scriptures\"", summary: "Chrysostom says everyone knew Christ died, but not that he suffered for the world's sins, so Paul appeals to the testimony of the Scriptures.", quote: "The fact indeed of his death all knew, but that He suffered this for the sins of the world was no longer equally known to the multitude. Wherefore he brings in the testimony from the Scriptures.", anchor: "The fact indeed of his death all knew", anchorEnd: "testimony from the Scriptures" },
        { who: "Gregory of Nazianzus", work: "Oration 45 (Second Oration on Easter)", where: "section 22", url: "https://www.newadvent.org/fathers/310245.htm", about: "To whom was Christ's blood offered, and why was it shed?", summary: "Gregory argues that the Father accepted Christ's offering without asking for or demanding it, so that humanity might be sanctified, the tyrant overcome, and we drawn to God.", quote: "Is it not evident that the Father accepts Him, but neither asked for Him nor demanded Him; but on account of the Incarnation, and because Humanity must be sanctified by the Humanity of God, that He might deliver us Himself, and overcome the tyrant, and draw us to Himself by the mediation of His Son, Who also arranged this to the honour of the Father, Whom it is manifest that He obeys in all things?", anchor: "Is it not evident that the Father", anchorEnd: "obeys in all things" }
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
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 16", where: "", url: "https://www.newadvent.org/fathers/310116.htm", about: "Lecture on the Holy Spirit, the Comforter, who spoke by the prophets", summary: "Cyril says the Spirit is called the Comforter because he comforts and encourages us, helps our weakness, and intercedes for us in prayer.", quote: "And He is called the Comforter, because He comforts and encourages us, and helps our infirmities; for we know not what we should pray for as we ought; but the Spirit Himself makes intercession for us, with groanings which cannot be uttered", anchor: "And He is called the Comforter", anchorEnd: "groanings which cannot be uttered" },
        { who: "John Chrysostom", work: "Homily 75 on the Gospel of John", where: "on John 14:15–31", url: "https://www.newadvent.org/fathers/240175.htm", about: "Homily on Christ's promise of \"another Comforter\"", summary: "Chrysostom says the frightened disciples, once they received the Spirit, faced every danger and, though unlettered, spoke boldly enough to astonish their hearers.", quote: "For they who now trembled and feared, after they had received the Spirit sprang into the midst of dangers, and stripped themselves for the contest against steel, and fire, and wild beasts, and seas, and every kind of punishment; and they, the unlettered and ignorant, discoursed so boldly as to astonish their hearers.", anchor: "For they who now trembled and feared", anchorEnd: "as to astonish their hearers" },
        { who: "John Chrysostom", work: "Homily 78 on the Gospel of John", where: "on John 16:4–15", url: "https://www.newadvent.org/fathers/240178.htm", about: "The Spirit convicting the world and guiding into all truth", summary: "Chrysostom explains that the Spirit convicts the world of righteousness by removing the excuse that Jesus was a sinner not sent from God.", quote: "For since they continually urged this against Him, that He was not from God, and therefore called Him a sinner and transgressor, He says, that the Spirit shall take from them this excuse also.", anchor: "For since they continually urged this against", anchorEnd: "take from them this excuse also" }
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
        { who: "John Chrysostom", work: "Homily 39 on First Corinthians", where: "on 1 Cor. 15:11–28", url: "https://www.newadvent.org/fathers/220139.htm", about: "Homily on \"if Christ has not been raised\" and Christ the firstfruits", summary: "Chrysostom reasons that if Christ did not rise, his death did not take away sin, so believers remain in their sins and both preaching and faith are in vain.", quote: "But if He rose not again, neither was He slain: and if He was not slain, neither was sin taken away: and if it was not taken away, you are in it: and if you are in it, we have preached in vain: and if we have preached in vain, you have believed in vain that you were reconciled.", anchor: "But if He rose not again", anchorEnd: "that you were reconciled" },
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 14", where: "", url: "https://www.newadvent.org/fathers/310114.htm", about: "Lecture on Christ's resurrection, ascension, and session at God's right hand", summary: "Cyril notes that Elisha and Elijah raised the dead but neither conquered the world nor drove out devils in his name, setting Christ's resurrection above theirs.", quote: "Eliseus then raised a dead man, but he conquered not the world; Elias raised a dead man, but devils are not driven away in the name of Elias.", anchor: "Eliseus then raised a dead man", anchorEnd: "in the name of Elias" }
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
        { who: "Theophilus of Antioch", work: "To Autolycus, Book 2", where: "chs. 10–18", url: "https://www.newadvent.org/fathers/02042.htm", about: "Walk through the six days of creation in Genesis 1", summary: "Theophilus says the prophets taught that God made everything out of nothing, needing nothing himself, and prepared the world for humanity, by whom he might be known.", quote: "And first, they taught us with one consent that God made all things out of nothing; for nothing was coeval with God: but He being His own place, and wanting nothing, and existing before the ages, willed to make man by whom He might be known; for him, therefore, He prepared the world.", anchor: "they taught us with one consent that God", anchorEnd: "He prepared the world" },
        { who: "Athanasius", work: "On the Incarnation", where: "chs. 2–3", url: "https://www.newadvent.org/fathers/2802.htm", about: "Creation out of nothing through the Word, against rival theories", summary: "Athanasius says God, being goodness itself and grudging existence to none, made all things out of nothing through his Word, Jesus Christ.", quote: "For God is good, or rather is essentially the source of goodness: nor could one that is good be niggardly of anything: whence, grudging existence to none, He has made all things out of nothing by His own Word, Jesus Christ our Lord.", anchor: "For God is good", anchorEnd: "Jesus Christ our Lord" },
        { who: "Augustine", work: "City of God, Book 11", where: "chs. 4–8", url: "https://www.newadvent.org/fathers/120111.htm", about: "The world's beginning, the creation days, and God's seventh-day rest", summary: "Augustine argues that even apart from the prophets, the world's ordered changes and beauty testify that it was created, and could only have been created by God.", quote: "For, though the voices of the prophets were silent, the world itself, by its well-ordered changes and movements, and by the fair appearance of all visible things, bears a testimony of its own, both that it has been created, and also that it could not have been created save by God, whose greatness and beauty are unutterable and invisible.", anchor: "though the voices of the prophets were silent", anchorEnd: "are unutterable and invisible" }
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
        { who: "Irenaeus of Lyons", work: "Against Heresies, Book 3", where: "ch. 23", url: "https://www.newadvent.org/fathers/0103323.htm", about: "Adam's sin, the curse on the serpent, and Adam's salvation in Christ", summary: "Irenaeus notes that after Adam sinned God cursed the ground rather than Adam personally, citing an ancient writer that the curse was transferred to the earth so as not to remain on man.", quote: "It was for this reason, too, that immediately after Adam had transgressed, as the Scripture relates, He pronounced no curse against Adam personally, but against the ground, in reference to his works, as a certain person among the ancients has observed: \"God did indeed transfer the curse to the earth, that it might not remain in man.\"", anchor: "that immediately after Adam had transgressed", anchorEnd: "might not remain in man" },
        { who: "Theophilus of Antioch", work: "To Autolycus, Book 2", where: "chs. 21–26", url: "https://www.newadvent.org/fathers/02042.htm", about: "The fall, the tree of knowledge, and expulsion from paradise", summary: "Theophilus says the tree of knowledge and its fruit were good; death came not from the tree but from disobedience.", quote: "The tree of knowledge itself was good, and its fruit was good. For it was not the tree, as some think, but the disobedience, which had death in it.", anchor: "The tree of knowledge itself was good", anchorEnd: "which had death in it" },
        { who: "Athanasius", work: "On the Incarnation", where: "chs. 4–5", url: "https://www.newadvent.org/fathers/2802.htm", about: "How the transgression brought corruption and death on humanity", summary: "Athanasius says humans, rejecting eternal things at the devil's counsel, brought corruption and death on themselves, though by the Word's grace they would have escaped it.", quote: "But men, having rejected things eternal, and, by counsel of the devil, turned to the things of corruption, became the cause of their own corruption in death, being, as I said before, by nature corruptible, but destined, by the grace following from partaking of the Word, to have escaped their natural state, had they remained good.", anchor: "having rejected things eternal", anchorEnd: "had they remained good" }
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
        { who: "Irenaeus of Lyons", work: "Against Heresies, Book 4", where: "ch. 16", url: "https://www.newadvent.org/fathers/0103416.htm", about: "The Decalogue compared with circumcision and ceremonial law", summary: "Irenaeus says the Lord himself spoke the Decalogue to all, so its words remain permanently with Christians, extended and increased by Christ's coming but not abolished.", quote: "Preparing man for this life, the Lord Himself did speak in His own person to all alike the words of the Decalogue; and therefore, in like manner, do they remain permanently with us, receiving by means of His advent in the flesh, extension and increase, but not abrogation.", anchor: "Preparing man for this life", anchorEnd: "but not abrogation" },
        { who: "Theophilus of Antioch", work: "To Autolycus, Book 3", where: "ch. 9", url: "https://www.newadvent.org/fathers/02043.htm", about: "The Christian doctrine of God and his law, citing the commandments", summary: "Theophilus says Christians have learned a holy law from the true God as lawgiver, who teaches them to act righteously, be pious, and do good.", quote: "And we have learned a holy law; but we have as lawgiver Him who is really God, who teaches us to act righteously, and to be pious, and to do good.", anchor: "And we have learned a holy law", anchorEnd: "and to do good" }
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
        { who: "John Chrysostom", work: "Homily 71 on Matthew", where: "on Matt. 22:34–46", url: "https://www.newadvent.org/fathers/200171.htm", about: "Homily on the first and great commandment and the second like it", summary: "Chrysostom says loving God means loving one's neighbor, as Christ told Peter 'feed my sheep,' and neighbor-love keeps the commandments, so all the law hangs on both.", quote: "If therefore to love God is to love one's neighbor, 'For if you love me,' He says, 'O Peter, feed my sheep,' but to love one's neighbor works a keeping of the commandments, with reason does He say, 'On these hang all the law and the prophets.'", anchor: "If therefore to love God is", anchorEnd: "all the law and the prophets" },
        { who: "Clement of Alexandria", work: "Who Is the Rich Man That Shall Be Saved?", where: "chs. 28–29", url: "https://www.newadvent.org/fathers/0207.htm", about: "Love of God first, then love of neighbor", summary: "Clement says both commandments are about love, but in order: the first part of love belongs to God, the second to our neighbor.", quote: "In both the commandments, then, He introduces love; but in order distinguishes it. And in the one He assigns to God the first part of love, and allots the second to our neighbour.", anchor: "In both the commandments", anchorEnd: "allots the second to our neighbour" }
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
        { who: "John Chrysostom", work: "Homily 15 on Matthew", where: "on Matt. 5:1–16", url: "https://www.newadvent.org/fathers/200115.htm", about: "Homily going through the Beatitudes one by one", summary: "Chrysostom explains that the \"poor in spirit\" are the humble and contrite, and that Christ blesses first those humble by choice, not by force of circumstance.", quote: "The humble and contrite in mind. For by \"spirit\" He has here designated the soul, and the faculty of choice. That is, since many are humble not willingly, but compelled by stress of circumstances; letting these pass (for this were no matter of praise), He blesses them first, who by choice humble and contract themselves.", anchor: "The humble and contrite in mind", anchorEnd: "humble and contract themselves" },
        { who: "Leo the Great", work: "Sermon 95", where: "on Matt. 5:1–9", url: "https://www.newadvent.org/fathers/360395.htm", about: "A homily on the Beatitudes", summary: "Leo says that by 'poor in spirit' Jesus means the kingdom belongs to those marked by humility of spirit rather than merely by small means.", quote: "But when He says \"blessed are the poor in spirit,\" He shows that the kingdom of heaven must be assigned to those who are recommended by the humility of their spirits rather than by the smallness of their means.", anchor: "But when He says", anchorEnd: "the smallness of their means" }
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
        { who: "Augustine", work: "Tractate 11 on the Gospel of John", where: "on John 2:23–3:5", url: "https://www.newadvent.org/fathers/1701011.htm", about: "Nicodemus and being born of water and the Spirit", summary: "Augustine says Nicodemus knew only one birth, but there are two: one earthly, fleshly and mortal, the other heavenly and spiritual, from God and the Church.", quote: "Whilst there are two births, then, he understood only one. One is of the earth, the other of heaven; one of the flesh, the other of the Spirit; one of mortality, the other of eternity; one of male and female, the other of God and the Church.", anchor: "Whilst there are two births", anchorEnd: "of God and the Church" },
        { who: "Justin Martyr", work: "First Apology", where: "ch. 61", url: "https://www.ccel.org/ccel/schaff/anf01.viii.ii.lxi.html", about: "Early description of baptism as new birth, citing John 3", summary: "Justin says converts are brought to water and regenerated as Christians themselves were, receiving the washing in the name of the Father, Jesus Christ, and the Holy Spirit.", quote: "Then they are brought by us where there is water, and are regenerated in the same manner in which we were ourselves regenerated. For, in the name of God, the Father and Lord of the universe, and of our Saviour Jesus Christ, and of the Holy Spirit, they then receive the washing with water.", anchor: "Then they are brought by us where", anchorEnd: "receive the washing with water" }
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
        { who: "John Chrysostom", work: "Homily 21 on Hebrews", where: "on Heb. 10:32–11:2", url: "https://www.newadvent.org/fathers/240221.htm", about: "Homily on faith as \"the substance of things hoped for\"", summary: "Chrysostom explains that faith is seeing what is not plain, giving unseen things the same full assurance as things that are seen.", quote: "For we say there is \"evidence,\" in the case of things that are very plain. Faith then is the seeing things not plain (he means), and brings what are not seen to the same full assurance with what are seen.", anchor: "For we say there is", anchorEnd: "with what are seen" },
        { who: "Clement of Rome", work: "First Epistle to the Corinthians (1 Clement)", where: "chs. 9–12", url: "https://www.newadvent.org/fathers/1010.htm", about: "Examples of faith: Enoch, Noah, Abraham, Lot, Rahab", summary: "Clement says that because of Abraham's faith and hospitality he was given a son in old age, and in obedience offered him as a sacrifice to God.", quote: "On account of his faith and hospitality, a son was given him in his old age; and in the exercise of obedience, he offered him as a sacrifice to God on one of the mountains which He showed him.", anchor: "On account of his faith and hospitality", anchorEnd: "mountains which He showed him" },
        { who: "Augustine", work: "Enchiridion (Handbook on Faith, Hope and Love)", where: "ch. 8", url: "https://www.newadvent.org/fathers/1302.htm", about: "Faith defined from Hebrews 11:1 and distinguished from hope", summary: "Augustine distinguishes hope from faith: hope concerns only what is good, future, and one's own, while faith can cover past, present, future, good and evil.", quote: "But hope has for its object only what is good, only what is future, and only what affects the man who entertains the hope.", anchor: "But hope has for its object", anchorEnd: "who entertains the hope" }
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
        { who: "John Chrysostom", work: "Commentary on Galatians", where: "ch. 5 (on Gal. 5:16–26)", url: "https://www.newadvent.org/fathers/23105.htm", about: "Works of the flesh versus the fruit of the Spirit", summary: "Chrysostom says Paul calls evil deeds 'works' because they come from us alone, but good deeds 'fruit' because they need both our effort and God's kindness.", quote: "And why does he say, 'the fruit of the Spirit?' it is because evil works originate in ourselves alone, and therefore he calls them 'works,' but good works require not only our diligence but God's loving kindness.", anchor: "And why does he say", anchorEnd: "loving kindness" },
        { who: "John Cassian", work: "Conferences, Conference 4 (Abbot Daniel)", where: "chs. 7–11", url: "https://www.newadvent.org/fathers/350804.htm", about: "The flesh lusting against the spirit (Gal. 5:17) explained", summary: "Cassian, through Abbot Daniel, explains that in Galatians 5:17 \"flesh\" means carnal will and evil desires, not the body, and \"spirit\" means the soul's good spiritual desires.", quote: "Wherefore in this passage we ought to take \"flesh\" as meaning not man, i.e., his material substance, but the carnal will and evil desires, just as \"spirit\" does not mean anything material, but the good and spiritual desires of the soul", anchor: "Wherefore in this passage we ought", anchorEnd: "spiritual desires of the soul" }
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
        { who: "Clement of Rome", work: "First Epistle to the Corinthians (1 Clement)", where: "chs. 49–50", url: "https://www.newadvent.org/fathers/1010.htm", about: "A hymn in praise of love", summary: "Clement praises love as what unites us to God, covers many sins, and patiently bears all things.", quote: "Love unites us to God. Love covers a multitude of sins. Love bears all things, is long-suffering in all things.", anchor: "Love unites us to God", anchorEnd: "is long-suffering in all things" },
        { who: "John Chrysostom", work: "Homily 33 on First Corinthians", where: "on 1 Cor. 13:4–8", url: "https://www.newadvent.org/fathers/220133.htm", about: "Homily on \"love suffers long and is kind\"", summary: "Chrysostom calls love the maker of every virtue and urges hearers to plant it carefully in their souls so it bears lasting fruit.", quote: "Since then love is the Artificer of all virtue, let us with all exactness implant her in our own souls, that she may produce for us many blessings, and that we may have her fruit continually abounding, the fruit which is ever fresh and never decays.", anchor: "Since then love is the Artificer", anchorEnd: "ever fresh and never decays" },
        { who: "John Chrysostom", work: "Homily 34 on First Corinthians", where: "on 1 Cor. 13:8–13", url: "https://www.newadvent.org/fathers/220134.htm", about: "Why love is greater than faith and hope", summary: "Chrysostom explains that faith and hope come to an end once what was believed and hoped for arrives, whereas love then grows even stronger.", quote: "For faith indeed and hope, when the good things believed and hoped for have come, cease.", anchor: "For faith indeed and hope", anchorEnd: "believed and hoped for have come" }
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
        { who: "Clement of Rome", work: "First Epistle to the Corinthians (1 Clement)", where: "ch. 18", url: "https://www.newadvent.org/fathers/1010.htm", about: "David's humility, quoting Psalm 51 at length", summary: "Clement notes that even David, whom God called a man after his own heart, humbly begs God for mercy and the blotting out of his transgression.", quote: "Yet this very man says to God, \"Have mercy on me, O Lord, according to Your great mercy; and according to the multitude of Your compassions, blot out my transgression.\"", anchor: "Yet this very man says to God", anchorEnd: "blot out my transgression" },
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 2 (On Repentance)", where: "sections 11–12", url: "https://www.newadvent.org/fathers/310102.htm", about: "David's sin, Nathan's rebuke, and David's repentance", summary: "Cyril says that although Nathan assured David his sin was put away, David kept repenting, exchanging purple and a golden throne for sackcloth and ashes.", quote: "Thus then did the Prophet comfort him, but the blessed David, for all he heard it said, The Lord has put away your sin, did not cease from repentance, king though he was, but put on sackcloth instead of purple, and instead of a golden throne, he sat, a king, in ashes on the ground", anchor: "Thus then did the Prophet comfort him", anchorEnd: "in ashes on the ground" }
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
        { who: "John Chrysostom", work: "Homily 21 on Matthew", where: "on Matt. 6:24 ff.", url: "https://www.newadvent.org/fathers/200121.htm", about: "Serving two masters, and the birds of the air", summary: "Chrysostom reasons that if God cares so much for lesser creatures like the birds, he will surely provide for his people.", quote: "For if of the things that are very inferior He has so much regard, how shall He not give unto you?", anchor: "For if of the things that are", anchorEnd: "shall He not give unto you" },
        { who: "John Chrysostom", work: "Homily 22 on Matthew", where: "on Matt. 6:28–34", url: "https://www.newadvent.org/fathers/200122.htm", about: "The lilies, seeking first the kingdom, and tomorrow's worries", summary: "Chrysostom notes Christ said earthly things 'shall be added,' not 'given,' to show they are a small part of God's gifts compared with what is to come.", quote: "And He said not, 'shall be given,' but 'shall be added,' that you might learn, that the things present are no great part of His gifts, compared with the greatness of the things to come.", anchor: "And He said not", anchorEnd: "greatness of the things to come" }
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
        { who: "John Chrysostom", work: "Homily 90 on Matthew", where: "on Matt. 28:11–20", url: "https://www.newadvent.org/fathers/200190.htm", about: "Homily on the command to disciple the nations and \"I am with you\"", summary: "Chrysostom says Christ's promise to be with them to the end was made not only to the apostles but to all later believers as one body.", quote: "And not with those men only did He promise to be, but also with all that believe after them. For plainly the apostles were not to remain here unto \"the end of the world;\" but he speaks to the believers as to one body.", anchor: "And not with those men only did", anchorEnd: "believers as to one body" },
        { who: "Basil of Caesarea", work: "On the Holy Spirit", where: "ch. 10", url: "https://www.newadvent.org/fathers/3203.htm", about: "The baptismal command of Matt. 28:19 and the Spirit's rank", summary: "Basil argues that since Christ commanded baptism in the name of the Father, Son and Holy Spirit, refusing to rank the Spirit with them openly defies God's command.", quote: "If our Lord, when enjoining the baptism of salvation, charged His disciples to baptize all nations in the name 'of the Father and of the Son and of the Holy Ghost,' not disdaining fellowship with Him, and these men allege that we must not rank Him with the Father and the Son, is it not clear that they openly withstand the commandment of God?", anchor: "charged His disciples to baptize all nations", anchorEnd: "withstand the commandment of God" }
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
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 3 (On Baptism)", where: "", url: "https://www.newadvent.org/fathers/310103.htm", about: "Lecture on baptism, with Romans 6:3–4 as its text", summary: "Cyril says that in baptism one goes down into the water carrying sins, dead in them, and comes up made alive in righteousness, sealed by grace.", quote: "For you go down into the water, bearing your sins, but the invocation of grace, having sealed your soul, suffers you not afterwards to be swallowed up by the terrible dragon. Having gone down dead in sins, you come up quickened in righteousness.", anchor: "For you go down into the water", anchorEnd: "come up quickened in righteousness" },
        { who: "John Chrysostom", work: "Homily 10 on Romans", where: "on Rom. 5:12–6:4", url: "https://www.newadvent.org/fathers/210210.htm", about: "Homily ending on baptism into Christ's death", summary: "Chrysostom says baptism is to believers what the cross and burial were to Christ: he died and was buried in the flesh, we to sin.", quote: "What the Cross then, and Burial, is to Christ, that Baptism has been to us, even if not in the same respects. For He died Himself and was buried in the Flesh, but we have done both to sin.", anchor: "that Baptism has been to us", anchorEnd: "we have done both to sin" },
        { who: "Basil of Caesarea", work: "On the Holy Spirit", where: "ch. 15", url: "https://www.ccel.org/ccel/schaff/npnf208.vii.xvi.html", about: "Baptism as a figure of burial with Christ and new life by the Spirit", summary: "Basil says that in baptism the water, receiving the body as in a tomb, figures death, while the Spirit gives life, renewing souls from the deadness of sin.", quote: "the water receiving the body as in a tomb figures death, while the Spirit pours in the quickening power, renewing our souls from the deadness of sin unto their original life.", anchor: "the water receiving the body", anchorEnd: "unto their original life" }
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
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 22 (Mystagogical Lecture 4)", where: "", url: "https://www.newadvent.org/fathers/310122.htm", about: "Lecture on the Body and Blood of Christ, on 1 Cor. 11:23", summary: "Cyril says that since Christ himself declared of the bread \"This is My Body\" and of the cup \"This is My Blood,\" no one should doubt it.", quote: "Since then He Himself declared and said of the Bread, This is My Body, who shall dare to doubt any longer? And since He has Himself affirmed and said, This is My Blood, who shall ever hesitate, saying, that it is not His blood?", anchor: "Since then He Himself declared and said", anchorEnd: "that it is not His blood" },
        { who: "John Chrysostom", work: "Homily 27 on First Corinthians", where: "on 1 Cor. 11:17–27", url: "https://www.newadvent.org/fathers/220127.htm", about: "The Lord's Supper and the Corinthians' divided meals", summary: "Chrysostom rebukes the Corinthians: Christ gave his Body equally to all, yet they would not share even common bread equally.", quote: "He gave His Body equally, but dost not thou give so much as the common bread equally? Yea, it was indeed broken for all alike, and became the Body equally for all.", anchor: "He gave His Body equally", anchorEnd: "the Body equally for all" },
        { who: "Irenaeus of Lyons", work: "Against Heresies, Book 4", where: "ch. 18", url: "https://www.newadvent.org/fathers/0103418.htm", about: "The Church's offering of the bread and cup", summary: "Irenaeus says bread receiving God's invocation becomes the Eucharist, earthly and heavenly, and our bodies receiving it gain the hope of resurrection.", quote: "For as the bread, which is produced from the earth, when it receives the invocation of God, is no longer common bread, but the Eucharist, consisting of two realities, earthly and heavenly; so also our bodies, when they receive the Eucharist, are no longer corruptible, having the hope of the resurrection to eternity.", anchor: "which is produced from the earth", anchorEnd: "of the resurrection to eternity" }
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
        { who: "John Chrysostom", work: "Homily 30 on First Corinthians", where: "on 1 Cor. 12:12–20", url: "https://www.newadvent.org/fathers/220130.htm", about: "One body, many members, baptized by one Spirit", summary: "Chrysostom explains that Paul's body image means the Church and Christ are one, just as body and head make one man.", quote: "For as the body and the head are one man, so he said that the Church and Christ are one.", anchor: "For as the body and the head", anchorEnd: "the Church and Christ are one" },
        { who: "John Chrysostom", work: "Homily 31 on First Corinthians", where: "on 1 Cor. 12:21–26", url: "https://www.newadvent.org/fathers/220131.htm", about: "Weaker members, and suffering and rejoicing together", summary: "Chrysostom illustrates Paul's point: when a thorn pierces the heel, the whole body feels it and every member works together to remove it.", quote: "Thus often when a thorn is fixed in the heel, the whole body feels it and cares for it: both the back is bent and the belly and thighs are contracted, and the hands coming forth as guards and servants draw out what was so fixed, and the head stoops over it, and the eyes observe it with much care.", anchor: "Thus often when a thorn is fixed", anchorEnd: "observe it with much care" },
        { who: "Origen", work: "Against Celsus, Book 6", where: "ch. 48", url: "https://www.ccel.org/ccel/schaff/anf04.vi.ix.vi.xlviii.html", about: "The whole Church as the body of Christ", summary: "Origen says the Scriptures call the whole Church the body of Christ, animated by the Son of God, with believers as its members moved by the Word." }
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
        { who: "John Chrysostom", work: "Homily 22 on Ephesians", where: "on Eph. 6:5–13", url: "https://www.newadvent.org/fathers/230122.htm", about: "Wrestling not against flesh and blood; putting on God's armor", summary: "Chrysostom says Paul rouses believers to vigilance by teaching that their enemy is skilled in war and fights not openly but with great cunning.", quote: "Now therefore the Apostle is by this means both rousing the soldiers, and making them vigilant, by persuading and instructing them, that our conflict is with one skilled in the arts of war, and with one who wars not simply, nor directly, but with much wiliness.", anchor: "Now therefore the Apostle is by this means", anchorEnd: "but with much wiliness" },
        { who: "John Chrysostom", work: "Homily 24 on Ephesians", where: "on Eph. 6:14–17 ff.", url: "https://www.newadvent.org/fathers/230124.htm", about: "Breastplate, shield, helmet, sword, and prayer explained", summary: "Chrysostom says the breastplate of righteousness means a life of all-round virtue, which no one, not even the devil, can pierce through.", quote: "As the breastplate is impenetrable, so also is righteousness, and by righteousness here he means a life of universal virtue. Such a life no one shall ever be able to overthrow; it is true, many wound him, but no one cuts through him, no, not the devil himself.", anchor: "As the breastplate is impenetrable", anchorEnd: "not the devil himself" },
        { who: "Ignatius of Antioch", work: "Epistle to Polycarp", where: "ch. 6", url: "https://www.newadvent.org/fathers/0110.htm", about: "Baptism, faith, love, and patience pictured as a soldier's armor", summary: "Ignatius urges believers to take baptism as their weapons, faith as helmet, love as spear, and patience as full armor.", quote: "Let your baptism endure as your arms; your faith as your helmet; your love as your spear; your patience as a complete panoply.", anchor: "Let your baptism endure as your arms", anchorEnd: "patience as a complete panoply" }
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
        { who: "Tertullian", work: "Against Marcion, Book 2", where: "ch. 24", url: "https://www.ccel.org/ccel/schaff/anf03.v.iv.iii.xxiv.html", about: "What God's \"repenting\" over Nineveh means", summary: "Tertullian argues that God's \"repenting\" over Nineveh means a change of mind in response to changed circumstances, not the confession of a sin.", quote: "Now in Greek the word for repentance (μετάνοια) is formed, not from the confession of a sin, but from a change of mind, which in God we have shown to be regulated by the occurrence of varying circumstances.", anchor: "Now in Greek the word for repentance", anchorEnd: "occurrence of varying circumstances" },
        { who: "Augustine", work: "Letter 102 (to Deogratias)", where: "Question 6, sections 30–37", url: "https://www.newadvent.org/fathers/1102102.htm", about: "Questions on Jonah: the great fish, the gourd, and the worm", summary: "Augustine reads Jonah's grief at Nineveh's salvation as a figure of carnal Israel resenting the deliverance of the Gentiles, whom Christ came to call to repentance.", quote: "He prefigured the carnal people of Israel. For he also was grieved at the salvation of the Ninevites, that is, at the redemption and deliverance of the Gentiles, from among whom Christ came to call, not righteous men, but sinners to repentance.", anchor: "He prefigured the carnal people of Israel", anchorEnd: "but sinners to repentance" }
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
        { who: "John Chrysostom", work: "Homily 28 on Matthew", where: "on Matt. 8:23 ff.", url: "https://www.newadvent.org/fathers/200128.htm", about: "Homily on the calming of the storm (parallel to Mark 4)", summary: "Chrysostom explains the disciples' amazement: Jesus' sleep and appearance showed him a man, while the obedient sea and calm declared him God.", quote: "So on this account they were cast into perplexity, saying, 'What manner of man is this?' since while the sleep and the outward appearance showed man, the sea and the calm declared Him God.", anchor: "So on this account they were cast", anchorEnd: "calm declared Him God" },
        { who: "Augustine", work: "Sermon 13 on New Testament Lessons (Ben. 63)", where: "on Matt. 8:23", url: "https://www.newadvent.org/fathers/160313.htm", about: "Christ asleep in the boat during the storm", summary: "Augustine applies the storm story to the soul: when we forget Christ he is asleep in us, so we must rouse him by remembering and heeding him.", quote: "What does this mean, Christ is asleep in you? You have forgotten Christ. Rouse Him up then, call Christ to mind, let Christ awake in you, give heed to Him.", anchor: "What does this mean", anchorEnd: "give heed to Him" }
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
        { who: "John Chrysostom", work: "Homily 70 on the Gospel of John", where: "on John 13:1–2 ff.", url: "https://www.newadvent.org/fathers/240170.htm", about: "Homily on Jesus washing the disciples' feet", summary: "Chrysostom says John shows Christ's great care and love for his disciples, teaching them humility, which Christ called the beginning and end of virtue.", quote: "But St. John has said it here in a more human sense, showing His great care for them, and declaring His unutterable love, that He now cared for them as for His own; teaching them the mother of all good, even humblemindedness, which He said was both the beginning and the end of virtue.", anchor: "has said it here in a more human sense", anchorEnd: "the end of virtue" },
        { who: "John Chrysostom", work: "Homily 71 on the Gospel of John", where: "on John 13:1–18", url: "https://www.newadvent.org/fathers/240171.htm", about: "\"You also ought to wash one another's feet\"", summary: "Chrysostom says that since the One enthroned on the Cherubim washed even the traitor's feet, no human being made of dust has any ground for pride.", quote: "He who sits upon the Cherubim washed the feet of the traitor, and do you, O man, you that are earth and ashes and cinders and dust, do you exalt yourself, and are you highminded?", anchor: "He who sits upon the Cherubim", anchorEnd: "and are you highminded" },
        { who: "Ambrose", work: "On the Mysteries", where: "ch. 6", url: "https://www.newadvent.org/fathers/3405.htm", about: "Foot-washing after baptism, read in light of John 13", summary: "Ambrose says Peter's feet were washed to take away hereditary sin, since one's own sins are forgiven through baptism.", quote: "His feet were therefore washed, that hereditary sins might be done away, for our own sins are remitted through baptism.", anchor: "His feet were therefore washed", anchorEnd: "remitted through baptism" }
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
        { who: "Irenaeus of Lyons", work: "Against Heresies, Book 5", where: "ch. 35", url: "https://www.newadvent.org/fathers/0103535.htm", about: "The new heaven, new earth, and new Jerusalem of Revelation 21", summary: "Irenaeus says the earthly Jerusalem is an image of the new Jerusalem, a place where the righteous are trained for incorruption and prepared for salvation.", quote: "Of this Jerusalem the former one is an image — that Jerusalem of the former earth in which the righteous are disciplined beforehand for incorruption and prepared for salvation.", anchor: "Of this Jerusalem the former one is an image", anchorEnd: "prepared for salvation" },
        { who: "Irenaeus of Lyons", work: "Against Heresies, Book 5", where: "ch. 36", url: "https://www.newadvent.org/fathers/0103536.htm", about: "Creation renewed after the present world passes away", summary: "Irenaeus teaches that when this world's present form passes away and humanity is renewed, there will be a new heaven and earth where renewed humanity lives with God forever.", quote: "But when this [present] fashion [of things] passes away, and man has been renewed, and flourishes in an incorruptible state, so as to preclude the possibility of becoming old, [then] there shall be the new heaven and the new earth, in which the new man shall remain [continually], always holding fresh converse with [God].", anchor: "and man has been renewed", anchorEnd: "always holding fresh converse with [God]" },
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 15", where: "sections 3–4", url: "https://www.newadvent.org/fathers/310115.htm", about: "The present world passing away and being renewed", summary: "Cyril teaches that the heavens will pass away not to be destroyed but to be raised up again more beautiful, like a resurrection of creation.", quote: "Let us not sorrow, as if we alone died; the stars also shall die; but perhaps rise again. And the Lord rolls up the heavens, not that He may destroy them, but that He may raise them up again more beautiful.", anchor: "Let us not sorrow", anchorEnd: "up again more beautiful" }
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
        { who: "John Chrysostom", work: "Homilies on Matthew", where: "Homily 82 (Matt 26:26-28)", url: "https://www.newadvent.org/fathers/200182.htm", about: "Homily on the Last Supper, instituted at Passover; the type giving way to the truth", summary: "Chrysostom says Christ instituted the sacrament at Passover to show he is the Old Testament's lawgiver and that its contents foreshadowed these events.", quote: "Why can it have been that He ordained this sacrament then, at the time of the passover? That you might learn from everything, both that He is the lawgiver of the Old Testament, and that the things therein are foreshadowed because of these things.", anchor: "Why can it have been that He ordained", anchorEnd: "foreshadowed because of these things" },
        { who: "Gregory of Nazianzus", work: "Oration 45 (Second Oration on Easter)", where: "Sections 11-16", url: "https://www.newadvent.org/fathers/310245.htm", about: "Easter sermon reading the Passover lamb and its rites as pointing to Christ", summary: "Gregory says Christ, the great Victim, was joined with the Law's sacrifices as a purification for the whole world and for all time.", quote: "But that great, and if I may say so, in Its first nature unsacrificeable Victim, was intermingled with the Sacrifices of the Law, and was a purification, not for a part of the world, nor for a short time, but for the whole world and for all time.", anchor: "in Its first nature unsacrificeable Victim", anchorEnd: "whole world and for all time" },
        { who: "Justin Martyr", work: "Dialogue with Trypho", where: "Chapter 40", url: "https://www.newadvent.org/fathers/01283.htm", about: "The roasted Passover lamb as a figure of Christ's cross", summary: "Justin says the roasted Passover lamb, pierced by one spit lengthwise and another across, is dressed up in the form of the cross.", quote: "For the lamb, which is roasted, is roasted and dressed up in the form of the cross. For one spit is transfixed right through from the lower parts up to the head, and one across the back, to which are attached the legs of the lamb.", anchor: "roasted and dressed up in the form", anchorEnd: "attached the legs of the lamb" }
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
        { who: "Clement of Rome", work: "First Epistle to the Corinthians (1 Clement)", where: "Chapters 32-33", url: "https://www.newadvent.org/fathers/1010.htm", about: "Justified by faith, not our own works; yet good works must not be abandoned", summary: "Clement, right after saying we are justified by faith, insists that believers must not grow lazy in doing good but eagerly perform every good work.", quote: "Shall we become slothful in well-doing, and cease from the practice of love? God forbid that any such course should be followed by us! But rather let us hasten with all energy and readiness of mind to perform every good work.", anchor: "Shall we become slothful in", anchorEnd: "perform every good work" },
        { who: "Augustine", work: "On Grace and Free Will", where: "Chapter 18", url: "https://www.newadvent.org/fathers/1510.htm", about: "Reconciling Paul and James: the faith that works by love", summary: "Augustine argues that mere belief, like the demons', is not the faith by which the just live; true faith works by love and God rewards it with eternal life.", quote: "Therefore they possess not the faith by which the just man lives — the faith which works by love in such wise, that God recompenses it according to its works with eternal life.", anchor: "Therefore they possess not the faith", anchorEnd: "works with eternal life" },
        { who: "John Chrysostom", work: "Homilies on Romans", where: "Homily 7 (Rom 3:9-31)", url: "https://www.newadvent.org/fathers/210207.htm", about: "Homily on God's righteousness apart from the Law, received through faith", summary: "Chrysostom says Paul shows God's power in saving, justifying, and giving grounds for boasting without needing works, looking for faith only.", quote: "Here he shows God's power, in that He has not only saved, but has even justified, and led them to boasting, and this too without needing works, but looking for faith only.", anchor: "in that He has not only saved", anchorEnd: "but looking for faith only" }
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
        { who: "John Chrysostom", work: "Homilies on Galatians", where: "Homily 3 (Galatians 3)", url: "https://www.newadvent.org/fathers/23103.htm", about: "Homily on Abraham's faith, the promised seed, and the Law's temporary role", summary: "Chrysostom argues that Abraham's true sons are those who follow his faith, not his bloodline, so the Gentiles are brought into kinship with him.", quote: "If then those were Abraham's sons, not, who were related to him by blood, but who follow his faith, for this is the meaning of the words, 'In you all the nations,' it is plain that the heathen are brought into kindred with him.", anchor: "If then those were", anchorEnd: "brought into kindred with him" },
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 4, Chapter 21", url: "https://www.newadvent.org/fathers/0103421.htm", about: "Abraham's faith as identical with Christian faith; patriarchs prefiguring the Church", summary: "Irenaeus says Abraham is the father of Gentile believers because his faith and ours are the same, trusting God's promise of things still future.", quote: "this man was not only the prophet of faith, but also the father of those who from among the Gentiles believe in Jesus Christ, because his faith and ours are one and the same: for he believed in things future, as if they were already accomplished, because of the promise of God", anchor: "this man was not only the prophet", anchorEnd: "the promise of God" },
        { who: "Justin Martyr", work: "Dialogue with Trypho", where: "Chapters 119-120", url: "https://www.newadvent.org/fathers/01288.htm", about: "Believers from the nations as the people promised to Abraham", summary: "Justin says Christians, as Abraham's children through a faith like his, will inherit the holy land with him forever.", quote: "And along with Abraham we shall inherit the holy land, when we shall receive the inheritance for an endless eternity, being children of Abraham through the like faith.", anchor: "And along with Abraham we shall inherit", anchorEnd: "Abraham through the like faith" }
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
        { who: "Barnabas (attributed)", work: "Epistle of Barnabas", where: "Chapter 16", url: "https://www.newadvent.org/fathers/0124.htm", about: "The true, spiritual temple of God built in believers' hearts", summary: "Barnabas says believers, forgiven and trusting in the Lord's name, are made new, so that God truly dwells in them as his temple.", quote: "Having received the forgiveness of sins, and placed our trust in the name of the Lord, we have become new creatures, formed again from the beginning. Wherefore in our habitation God truly dwells in us.", anchor: "Having received the forgiveness of sins", anchorEnd: "God truly dwells in us" },
        { who: "John Chrysostom", work: "Homilies on the Gospel of John", where: "Homily 11 (John 1:14)", url: "https://www.newadvent.org/fathers/240111.htm", about: "Homily on 'the Word was made flesh and dwelt among us'", summary: "Chrysostom says the Word dwells in the tabernacle of our flesh forever, having put it on not to leave it but to keep it always.", quote: "He inhabits this tabernacle for ever, for He clothed Himself with our flesh, not as again to leave it, but always to have it with Him.", anchor: "He inhabits this tabernacle for ever", anchorEnd: "always to have it with Him" }
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
        { who: "Justin Martyr", work: "Dialogue with Trypho", where: "Chapter 31", url: "https://www.newadvent.org/fathers/01283.htm", about: "Quotes Daniel 7's Son of Man vision of Christ's glorious coming", summary: "Justin argues that if such power followed Christ's suffering, far greater power will follow his glorious advent, when he comes on the clouds as the Son of man Daniel foretold.", quote: "But if so great a power is shown to have followed and to be still following the dispensation of His suffering, how great shall that be which shall follow His glorious advent! For He shall come on the clouds as the Son of man, so Daniel foretold, and His angels shall come with Him.", anchor: "But if so great a power is shown", anchorEnd: "angels shall come with Him" },
        { who: "John Chrysostom", work: "Homilies on Matthew", where: "Homily 84 (Matt 26:51-66)", url: "https://www.newadvent.org/fathers/200184.htm", about: "Homily on Jesus' answer to the high priest and the blasphemy charge", summary: "Chrysostom says Christ's answer to the high priest, that he sits at the Father's right hand and will come to judge, left his accusers no excuse.", quote: "Why then did they now call the saying a blasphemy? And wherefore also did Christ thus answer them? To take away all their excuse, because unto the last day He taught that He was Christ, and that He sits at the right hand of the Father, and that He will come again to judge the world, which was the language of one manifesting His full accordance with the Father.", anchor: "Why then did they now call", anchorEnd: "full accordance with the Father" },
        { who: "Cyril of Jerusalem", work: "Catechetical Lectures", where: "Lecture 15", url: "https://www.newadvent.org/fathers/310115.htm", about: "Lecture on Christ's coming in glory, drawing on Daniel 7", summary: "Citing Daniel's vision of one like the Son of Man receiving an everlasting dominion, Cyril insists that Christ's kingdom will never end.", quote: "These things rather hold fast, these things believe, and cast away from you the words of heresy; for you have heard most plainly of the endless kingdom of Christ.", anchor: "These things rather hold fast", anchorEnd: "endless kingdom of Christ" }
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
        { who: "John Chrysostom", work: "Homilies on the Gospel of John", where: "Homily 56 (John 9:1-2)", url: "https://www.newadvent.org/fathers/240156.htm", about: "Homily on whether the man's blindness came from his or his parents' sin", summary: "Chrysostom says Jesus did not imply others are born blind for their parents' sins, since one person cannot be punished for another's sin.", quote: "And this He said, not signifying that though this man indeed was not in such case, yet that others had been made blind from such a cause, the sins of their parents, since it cannot be that when one sins another should be punished.", anchor: "not signifying that though this man indeed", anchorEnd: "another should be punished" },
        { who: "Augustine", work: "Tractates on the Gospel of John", where: "Tractate 44 (John 9)", url: "https://www.newadvent.org/fathers/1701044.htm", about: "Sermon on the man born blind 'that the works of God be manifest'", summary: "Augustine says the blind man's parents were sinners, yet their sin was not the reason he was born blind.", quote: "For his parents had sin; but not by reason of the sin itself did it come about that he was born blind.", anchor: "For his parents had sin", anchorEnd: "that he was born blind" }
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
        { who: "Barnabas (attributed)", work: "Epistle of Barnabas", where: "Chapter 7", url: "https://www.newadvent.org/fathers/0124.htm", about: "The Day of Atonement fast and the goats as types of Christ", summary: "Barnabas reads the two similar goats of the Day of Atonement as a type of Jesus, whom people will recognize with amazement when he comes again.", quote: "With a view to this, [He required] the goats to be of goodly aspect, and similar, that, when they see Him then coming, they may be amazed by the likeness of the goat. Behold, then, the type of Jesus who was to suffer.", anchor: "With a view to this", anchorEnd: "Jesus who was to suffer" },
        { who: "John Chrysostom", work: "Homilies on Hebrews", where: "Homily 15 (Heb 9:1-14)", url: "https://www.newadvent.org/fathers/240215.htm", about: "Homily contrasting the yearly high-priestly entry with Christ's once-for-all entry", summary: "Chrysostom argues that if the blood of bulls could purify the flesh, Christ's blood will much more wipe away the defilement of the soul.", quote: "For (he says) if 'the blood of bulls' is able to purify the flesh, much rather shall the Blood of Christ wipe away the defilement of the soul.", anchor: "is able to purify the flesh", anchorEnd: "the defilement of the soul" },
        { who: "Justin Martyr", work: "Dialogue with Trypho", where: "Chapter 40", url: "https://www.newadvent.org/fathers/01283.htm", about: "The two goats of the fast as figures of Christ's two comings", summary: "Justin says the two goats of the fast, one sent away as scapegoat and the other sacrificed, signified Christ's two appearances.", quote: "And the two goats which were ordered to be offered during the fast, of which one was sent away as the scape goat, and the other sacrificed, were similarly declarative of the two appearances of Christ:", anchor: "And the two goats which were ordered", anchorEnd: "two appearances of Christ" }
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
        { who: "John Chrysostom", work: "Homilies on Romans", where: "Homily 10 (Rom 5:12-21)", url: "https://www.newadvent.org/fathers/210210.htm", about: "Homily on Adam's disobedience and Christ's obedience and abounding grace", summary: "Chrysostom explains that Adam is a type of Christ: as Adam caused death for his descendants, Christ provides righteousness, through his Cross, to those sprung from him.", quote: "Why in that, as the former became to those who were sprung from him, although they had not eaten of the tree, the cause of that death which by his eating was introduced; thus also did Christ become to those sprung from Him, even though they had not wrought righteousness, the Provider of that righteousness which through His Cross He graciously bestowed on us all.", anchor: "as the former became to those who", anchorEnd: "He graciously bestowed on us all" },
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 5, Chapter 21", url: "https://www.newadvent.org/fathers/0103521.htm", about: "Christ recapitulating Adam, conquering the enemy who conquered humanity", summary: "Irenaeus argues that because the enemy first conquered humanity through Adam, the victory had to be won by a man born of a woman.", quote: "For indeed the enemy would not have been fairly vanquished, unless it had been a man [born] of a woman who conquered him.", anchor: "For indeed the enemy would not have", anchorEnd: "woman who conquered him" }
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
        { who: "Gregory of Nazianzus", work: "Oration 41 (On Pentecost)", where: "Sections 13, 16", url: "https://www.newadvent.org/fathers/310241.htm", about: "Pentecost sermon contrasting the tongues with Babel's confusion; cites Joel", summary: "Gregory of Nazianzus says Babel's confusion of tongues was good because it broke up a wicked unity, and Pentecost's miracle of tongues is even more praiseworthy.", quote: "But as the old Confusion of tongues was laudable, when men who were of one language in wickedness and impiety, even as some now venture to be, were building the Tower; for by the confusion of their language the unity of their intention was broken up, and their undertaking destroyed; so much more worthy of praise is the present miraculous one.", anchor: "But as the old Confusion of tongues", anchorEnd: "is the present miraculous one" },
        { who: "John Chrysostom", work: "Homilies on the Acts of the Apostles", where: "Homily 4 (Acts 2:1ff.)", url: "https://www.newadvent.org/fathers/210104.htm", about: "Homily on the Spirit's coming at Pentecost and the gift of tongues", summary: "Chrysostom contrasts the Spirit coming as a dove when revealed to John with coming \"like fire\" at Pentecost, when a whole multitude was to be converted.", quote: "For when the Spirit was to be made known to John, then it came upon the head of Christ as in the form of a dove: but now, when a whole multitude was to be converted, it is 'like as of fire.'", anchor: "For when the Spirit was to be", anchorEnd: "like as of fire" },
        { who: "John Chrysostom", work: "Homilies on the Acts of the Apostles", where: "Homily 5 (Acts 2:14-20)", url: "https://www.newadvent.org/fathers/210105.htm", about: "Homily on Peter's sermon quoting Joel's prophecy", summary: "Chrysostom reads Peter's citation of Joel, 'upon all flesh,' as meaning that the Spirit would be poured out on the Gentiles too.", quote: "On this account here also Peter says, 'I will pour out of my spirit upon all flesh;' that is, upon the Gentiles also.", anchor: "On this account here also Peter says", anchorEnd: "upon the Gentiles also" }
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
        { who: "John Chrysostom", work: "Homilies on Matthew", where: "Homily 16 (Matt 5:17-20)", url: "https://www.newadvent.org/fathers/200116.htm", about: "Homily on 'I came not to destroy the Law but to fulfil'", summary: "Chrysostom says Christ's teachings did not repeal the old commandments but extended and filled them out, so forbidding anger strengthens rather than cancels 'do not kill.'", quote: "For His sayings were no repeal of the former, but a drawing out, and filling up of them. Thus, \"not to kill,\" is not annulled by the saying, Be not angry, but rather is filled up and put in greater security: and so of all the others.", anchor: "For His sayings were no repeal", anchorEnd: "so of all the others" },
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 4, Chapter 13", url: "https://www.newadvent.org/fathers/0103413.htm", about: "Christ extending and fulfilling, not abolishing, the Law's natural precepts", summary: "Irenaeus says the Lord did not abolish the law's natural precepts, kept by the righteous before the law was given, but extended and fulfilled them.", quote: "And that the Lord did not abrogate the natural [precepts] of the law, by which man is justified, which also those who were justified by [faith], and who pleased [God], did observe previous to the giving of the law, but that He extended and fulfilled them, is shown from His words.", anchor: "And that the Lord did not abrogate", anchorEnd: "is shown from His words" }
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
        { who: "Cyprian of Carthage", work: "Epistle 62 (to Caecilius)", where: "Sections 4-5", url: "https://www.newadvent.org/fathers/050662.htm", about: "Melchizedek's bread and wine as a figure of Christ's priesthood", summary: "Cyprian argues that Christ is supremely the priest of the most high God, offering what Melchizedek offered, bread and wine, which is his body and blood.", quote: "For who is more a priest of the most high God than our Lord Jesus Christ, who offered a sacrifice to God the Father, and offered that very same thing which Melchizedek had offered, that is, bread and wine, to wit, His body and blood?", anchor: "For who is more a priest", anchorEnd: "His body and blood" },
        { who: "Augustine", work: "City of God", where: "Book 16, Chapter 22", url: "https://www.newadvent.org/fathers/120116.htm", about: "Melchizedek blessing Abraham; priest forever after his order", summary: "Augustine notes Abraham was openly blessed by Melchizedek, priest of God Most High, about whom Hebrews says many great things.", quote: "He was then openly blessed by Melchizedek, who was priest of God Most High, about whom many and great things are written in the epistle which is inscribed to the Hebrews, which most say is by the Apostle Paul, though some deny this.", anchor: "He was then openly blessed by Melchizedek", anchorEnd: "though some deny this" },
        { who: "Ambrose", work: "On the Mysteries", where: "Chapter 8", url: "https://www.newadvent.org/fathers/3405.htm", about: "Melchizedek's offering compared with the Christian sacrament", summary: "Ambrose stresses that Melchizedek, not Abraham, brought forth the bread and wine, and, citing Hebrews, presents him as like the Son of God.", quote: "It was not Abraham who brought them forth, but Melchisedech, who is introduced without father, without mother, having neither beginning of days, nor ending, but like the Son of God, of Whom Paul says to the Hebrews: \"that He remains a priest for ever,\" Who in the Latin version is called King of righteousness and King of peace.", anchor: "It was not Abraham who brought them forth", anchorEnd: "and King of peace" }
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
        { who: "Clement of Rome", work: "First Epistle to the Corinthians (1 Clement)", where: "Chapter 16", url: "https://www.newadvent.org/fathers/1010.htm", about: "Quotes Isaiah 53 at length of Christ as example of humility", summary: "Clement says Christ, though the majesty of God, came not in pride but in lowliness, as the Holy Spirit had foretold, introducing his long quotation of Isaiah 53.", quote: "Our Lord Jesus Christ, the Sceptre of the majesty of God, did not come in the pomp of pride or arrogance, although He might have done so, but in a lowly condition, as the Holy Spirit had declared regarding Him.", anchor: "Our Lord Jesus Christ", anchorEnd: "as the Holy Spirit had declared regarding Him" },
        { who: "John Chrysostom", work: "Homilies on the Acts of the Apostles", where: "Homily 19 (Acts 8:26-40)", url: "https://www.newadvent.org/fathers/210119.htm", about: "Homily on Philip and the Ethiopian reading Isaiah 53", summary: "Chrysostom suggests that from Isaiah's prophecy the eunuch learned that the crucified one did no sin, saved others, and has an unutterable generation.", quote: "It is likely he had heard that He was crucified, [and now he learns], that \"His life is taken away from the earth,\" and the rest that \"He did no [sin], nor deceit in His mouth:\" that He prevailed to save others also: [and] who He is, Whose generation is unutterable.", anchor: "It is likely he had heard that", anchorEnd: "Whose generation is unutterable" },
        { who: "Augustine", work: "City of God", where: "Book 18, Chapter 29", url: "https://www.newadvent.org/fathers/120118.htm", about: "Isaiah's predictions of Christ and the Church, from Isaiah 52:13", summary: "Augustine says Isaiah prophesied about Christ and the Church more than the other prophets, so that some call him an evangelist rather than a prophet.", quote: "Isaiah, then, together with his rebukes of wickedness, precepts of righteousness, and predictions of evil, also prophesied much more than the rest about Christ and the Church, that is, about the King and that city which he founded; so that some say he should be called an evangelist rather than a prophet.", anchor: "together with his rebukes of wickedness", anchorEnd: "evangelist rather than a prophet" }
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
        { who: "John Chrysostom", work: "Homilies on First Corinthians", where: "Homily 23 (1 Cor 9:24-10:12)", url: "https://www.newadvent.org/fathers/220123.htm", about: "Homily on the sea crossing as type of baptism; the Rock was Christ", summary: "Chrysostom explains that the wilderness water came not from the physical rock but from a spiritual Rock, Christ, who was with Israel and worked all the wonders.", quote: "For it was not the nature of the rock which sent forth the water, (such is his meaning,) else would it as well have gushed out before this time: but another sort of Rock, a spiritual One, performed the whole, even Christ who was every where with them and wrought all the wonders.", anchor: "For it was not the nature of the rock", anchorEnd: "wrought all the wonders" },
        { who: "Ambrose", work: "On the Mysteries", where: "Chapter 3", url: "https://www.newadvent.org/fathers/3405.htm", about: "The Red Sea crossing as a figure of baptism", summary: "Ambrose says the Red Sea crossing, where the Egyptian perished and the Hebrew escaped, prefigured baptism, in which guilt is swallowed up and innocence preserved.", quote: "You observe that even then holy baptism was prefigured in that passage of the Hebrews, wherein the Egyptian perished, the Hebrew escaped. For what else are we daily taught in this sacrament but that guilt is swallowed up and error done away, but that virtue and innocence remain unharmed?", anchor: "You observe that even then holy baptism", anchorEnd: "innocence remain unharmed" },
        { who: "Tertullian", work: "On Baptism", where: "Chapter 9", url: "https://www.newadvent.org/fathers/0321.htm", about: "Types of baptism in the Red Sea and water from the rock", summary: "Tertullian sees Israel's escape through the sea, whose water destroyed Pharaoh's forces, as a figure fulfilled in baptism, where the nations are freed from the world and leave the devil behind.", quote: "First, indeed, when the people, set unconditionally free, escaped the violence of the Egyptian king by crossing over through water, it was water that extinguished the king himself, with his entire forces. What figure more manifestly fulfilled in the sacrament of baptism? The nations are set free from the world by means of water, to wit: and the devil, their old tyrant, they leave quite behind, overwhelmed in the water.", anchor: "escaped the violence of the Egyptian king", anchorEnd: "overwhelmed in the water" }
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
        { who: "John Chrysostom", work: "Homilies on the Acts of the Apostles", where: "Homily 6 (Acts 2:22-36)", url: "https://www.newadvent.org/fathers/210106.htm", about: "Homily on Peter's argument from God's oath to David", summary: "Chrysostom says Peter appeals to the honour given to David and his descendants, so that hearers would accept Christ's resurrection as fulfilling the prophecy.", quote: "But this he says, that were it but on account of the honour shown to David, and the descent from him, they may accept what is said concerning Christ's resurrection, as seeing that it would be an injury to the prophecy", anchor: "But this he says", anchorEnd: "an injury to the prophecy" },
        { who: "Lactantius", work: "Divine Institutes", where: "Book 4, Chapter 13", url: "https://www.newadvent.org/fathers/07014.htm", about: "The promise of David's everlasting throne applied to Christ, not Solomon", summary: "Lactantius argues the promise cannot mean Solomon, who received the kingdom from David himself and reigned only forty years, but one born after David had died.", quote: "Now Solomon received the government of the kingdom from his father himself. But the prophets spoke of Him who was then born after that David had slept with his fathers. Besides, the reign of Solomon was not everlasting; for he reigned forty years.", anchor: "Now Solomon received the government of the kingdom", anchorEnd: "for he reigned forty years" }
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
        { who: "John Chrysostom", work: "Homilies on Second Corinthians", where: "Homily 7 (2 Cor 3:7-18)", url: "https://www.newadvent.org/fathers/220207.htm", about: "Homily on being transformed into the same image from glory to glory", summary: "Chrysostom compares the cleansed soul to polished silver facing the sun: it receives a ray from the Spirit's glory and reflects it back.", quote: "Just as if pure silver be turned towards the sun's rays, it will itself also shoot forth rays, not from its own natural property merely but also from the solar lustre; so also does the soul being cleansed and made brighter than silver, receive a ray from the glory of the Spirit, and send it back.", anchor: "Just as if pure silver be turned", anchorEnd: "and send it back" },
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 5, Chapter 16", url: "https://www.newadvent.org/fathers/0103516.htm", about: "The incarnate Word showing the true image and restoring the likeness", summary: "Irenaeus teaches that the incarnate Word truly showed forth God's image by becoming it, and restored humanity's likeness to the invisible Father through the visible Word.", quote: "When, however, the Word of God became flesh, He confirmed both these: for He both showed forth the image [truly], since He became Himself what was His image; and He re-established the similitude after a sure manner, by assimilating man to the invisible Father through means of the visible Word.", anchor: "He confirmed both these", anchorEnd: "means of the visible Word" },
        { who: "Augustine", work: "On the Trinity", where: "Book 14, Chapter 17", url: "https://www.newadvent.org/fathers/130114.htm", about: "How the image of God in us is renewed day by day", summary: "Augustine says the renewal of God's image in us is not completed at conversion, unlike baptism's instant forgiveness of all sins, but proceeds gradually.", quote: "Certainly this renewal does not take place in the single moment of conversion itself, as that renewal in baptism takes place in a single moment by the remission of all sins; for not one, be it ever so small, remains unremitted.", anchor: "Certainly this renewal does not take place", anchorEnd: "remains unremitted" }
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
        { who: "Cyprian of Carthage", work: "On the Lord's Prayer (Treatise 4)", where: "Section 13", url: "https://www.newadvent.org/fathers/050704.htm", about: "On 'Thy kingdom come'; Christ himself as the kingdom of God", summary: "Cyprian suggests that Christ himself may be the kingdom of God, whose coming believers long for daily.", quote: "Christ Himself, dearest brethren, however, may be the kingdom of God, whom we day by day desire to come, whose advent we crave to be quickly manifested to us.", anchor: "whom we day by day desire to come", anchorEnd: "quickly manifested to us" },
        { who: "Tertullian", work: "On Prayer", where: "Chapter 5", url: "https://www.newadvent.org/fathers/0322.htm", about: "On the petition 'Thy kingdom come' and longing for its arrival", summary: "Tertullian says Christians long for God's kingdom to come quickly, and would cry out for it even if the Prayer had not told them to.", quote: "Our wish is, that our reign be hastened, not our servitude protracted. Even if it had not been prescribed in the Prayer that we should ask for the advent of the kingdom, we should, unbidden, have sent forth that cry, hastening toward the realization of our hope.", anchor: "that our reign be hastened", anchorEnd: "the realization of our hope" }
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
        { who: "John Chrysostom", work: "Homilies on Galatians", where: "Homily 3 (Galatians 3)", url: "https://www.newadvent.org/fathers/23103.htm", about: "Homily on why the Law was added and its role as tutor until Christ", summary: "Chrysostom explains that the Law was added as a bridle to restrain the Jews from careless living and deeper wickedness, checking at least some transgressions.", quote: "Because of transgressions; that is to say, that the Jews might not be let live carelessly, and plunge into the depth of wickedness, but that the Law might be placed upon them as a bridle, guiding, regulating, and checking them from transgressing, if not all, at least some of the commandments.", anchor: "that the Jews might not be let live", anchorEnd: "some of the commandments" },
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 4, Chapter 16", url: "https://www.newadvent.org/fathers/0103416.htm", about: "Why the Law was given; patriarchs righteous without it; Decalogue's abiding place", summary: "Irenaeus says the righteous patriarchs before Moses had the Decalogue's meaning written in their hearts, loving God and doing no harm to their neighbour.", quote: "But the righteous fathers had the meaning of the Decalogue written in their hearts and souls, that is, they loved the God who made them, and did no injury to their neighbour.", anchor: "But the righteous fathers had the meaning", anchorEnd: "no injury to their neighbour" },
        { who: "John Chrysostom", work: "Homilies on Romans", where: "Homily 12 (Rom 6:19-7:13)", url: "https://www.newadvent.org/fathers/210212.htm", about: "Homily on the Law revealing sin, yet holy, just and good", summary: "Chrysostom says the Law did not create sin but exposed what had gone unnoticed, which is actually to the Law's credit.", quote: "For it did not give existence to sin that before was not, but only pointed out what had escaped notice. And this is even a praise of the Law, if at least before it they had been sinning without perceiving it.", anchor: "For it did not give existence to sin", anchorEnd: "sinning without perceiving it" }
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
        { who: "Justin Martyr", work: "Dialogue with Trypho", where: "Chapter 61", url: "https://www.newadvent.org/fathers/01285.htm", about: "Quotes Proverbs 8: Wisdom begotten of the Father, identified as Christ", summary: "Justin identifies the Wisdom speaking through Solomon in Proverbs as the Word, God begotten of the Father, who is also Wisdom, Power, and Glory.", quote: "The Word of Wisdom, who is Himself this God begotten of the Father of all things, and Word, and Wisdom, and Power, and the Glory of the Begetter, will bear evidence to me, when He speaks by Solomon the following:", anchor: "The Word of Wisdom", anchorEnd: "by Solomon the following" },
        { who: "Origen", work: "De Principiis (On First Principles)", where: "Book 1, Chapter 2", url: "https://www.newadvent.org/fathers/04121.htm", about: "Christ as the Wisdom of God, citing Proverbs 8", summary: "Origen says the Son is called Wisdom, citing Solomon's words in Proverbs 8 about Wisdom created before the ages and brought forth before the earth.", quote: "For He is termed Wisdom, according to the expression of Solomon: \"The Lord created me — the beginning of His ways, and among His works, before He made any other thing; He founded me before the ages. In the beginning, before He formed the earth, before He brought forth the fountains of waters, before the mountains were made strong, before all the hills, He brought me forth.\"", anchor: "For He is termed Wisdom", anchorEnd: "He brought me forth" }
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
        { who: "Barnabas (attributed)", work: "Epistle of Barnabas", where: "Chapter 15", url: "https://www.newadvent.org/fathers/0124.htm", about: "The false and true Sabbath; Christians keep the eighth day of resurrection", summary: "Barnabas says Christians joyfully keep the eighth day because it is the day Jesus rose from the dead.", quote: "Wherefore, also, we keep the eighth day with joyfulness, the day also on which Jesus rose again from the dead.", anchor: "we keep the eighth day with joyfulness", anchorEnd: "rose again from the dead" },
        { who: "John Chrysostom", work: "Homilies on Matthew", where: "Homily 39 (Matt 12:1-8)", url: "https://www.newadvent.org/fathers/200139.htm", about: "Homily on plucking grain on the Sabbath; Son of Man Lord of the Sabbath", summary: "Chrysostom says the Sabbath originally benefited Israel by teaching gentleness, God's providence and creation, and gradually training them away from wickedness toward spiritual things.", quote: "For indeed the Sabbath did at the first confer many and great benefits; for instance, it made them gentle towards those of their household, and humane; it taught them God's providence and the creation, as Ezekiel says; it trained them by degrees to abstain from wickedness, and disposed them to regard the things of the Spirit.", anchor: "For indeed the Sabbath did at the first", anchorEnd: "regard the things of the Spirit" },
        { who: "Justin Martyr", work: "Dialogue with Trypho", where: "Chapter 21", url: "https://www.newadvent.org/fathers/01282.htm", about: "Why the Sabbath was instituted for Israel", summary: "Justin argues that God commanded the Jews to keep the Sabbath and other precepts as a sign because of their and their fathers' unrighteousness.", quote: "Moreover, that God enjoined you to keep the Sabbath, and impose on you other precepts for a sign, as I have already said, on account of your unrighteousness, and that of your fathers — as He declares that for the sake of the nations, lest His name be profaned among them, therefore He permitted some of you to remain alive — these words of His can prove to you: they are narrated by Ezekiel thus:", anchor: "that God enjoined you to keep the Sabbath", anchorEnd: "narrated by Ezekiel thus" }
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
        { who: "John Chrysostom", work: "Homilies on Romans", where: "Homily 19 (Rom 11:7-34)", url: "https://www.newadvent.org/fathers/210219.htm", about: "Homily on the olive tree, grafted branches, and 'all Israel shall be saved'", summary: "Chrysostom warns Gentile believers not to boast against the Jews, since they have been set in Israel's place and enjoy Israel's goods.", quote: "Do not boast against them so as to sunder them. For it is into their place that you have been set, and their goods that you enjoy.", anchor: "Do not boast against them so as", anchorEnd: "their goods that you enjoy" },
        { who: "John Chrysostom", work: "Homilies on Ephesians", where: "Homily 5 (Eph 2:11-16)", url: "https://www.newadvent.org/fathers/230105.htm", about: "Homily on Jew and Gentile made one new man in Christ", summary: "Chrysostom says Christ did not turn Gentiles into Jews but brought both Jew and Gentile into a new condition as one new man.", quote: "Observe thou, that it is not that the Gentile has become a Jew, but that both the one and the other are entered into another condition.", anchor: "it is not that the Gentile has become", anchorEnd: "entered into another condition" }
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
        { who: "John Chrysostom", work: "Homilies on the Gospel of John", where: "Homily 45 (John 6:28-40)", url: "https://www.newadvent.org/fathers/240145.htm", about: "Homily contrasting the manna with Christ the bread of life", summary: "Chrysostom says Jesus calls himself the true bread not because the manna miracle was false, but because the manna was a type, not the reality itself.", quote: "And He calls that other the \"true bread,\" not because the miracle of the manna was false, but because it was a type, and not the very truth.", anchor: "And He calls that other the", anchorEnd: "and not the very truth" },
        { who: "Ambrose", work: "On the Mysteries", where: "Chapter 8", url: "https://www.newadvent.org/fathers/3405.htm", about: "The manna compared with the living bread from heaven", summary: "Ambrose contrasts the corruptible manna from heaven with the sacramental bread from the Lord of the heavens, which is free from corruption for those who receive it holily.", quote: "That manna came from heaven, this is above the heavens; that was of heaven, this is of the Lord of the heavens; that was liable to corruption, if kept a second day, this is far from all corruption, for whosoever shall taste it holily shall not be able to feel corruption.", anchor: "That manna came from heaven", anchorEnd: "able to feel corruption" }
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
        { who: "Cyril of Jerusalem", work: "Catechetical Lectures", where: "Lecture 18, section 15", url: "https://www.newadvent.org/fathers/310118.htm", about: "Old Testament witnesses to resurrection: Ezekiel 37, Daniel 12, Isaiah 26", summary: "Cyril cites Job, Isaiah, Ezekiel and Daniel as Old Testament witnesses to the resurrection, saying Ezekiel speaks of it most plainly.", quote: "And the Prophet Ezekiel now before us, says most plainly, Behold I will open your graves, and bring you up out of your graves.", anchor: "And the Prophet Ezekiel now before us", anchorEnd: "up out of your graves" },
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 5, Chapter 15", url: "https://www.newadvent.org/fathers/0103515.htm", about: "Isaiah 26:19 and Ezekiel's dry bones as prophecies of bodily resurrection", summary: "Irenaeus cites Isaiah's 'the dead shall rise again' as the Creator's promise of a second birth after man has dissolved into earth.", quote: "Now, that He who at the beginning created man, did promise him a second birth after his dissolution into earth, Esaias thus declares: \"The dead shall rise again, and they who are in the tombs shall arise, and they who are in the earth shall rejoice. For the dew which is from You is health to them.\"", anchor: "He who at the beginning created man", anchorEnd: "is health to them" },
        { who: "John Chrysostom", work: "Homilies on Matthew", where: "Homily 70 (Matt 22:15-33)", url: "https://www.newadvent.org/fathers/200170.htm", about: "Homily on the Sadducees and 'the God of Abraham... of the living'", summary: "Chrysostom says as Adam died by sentence the day he sinned though still alive, so the patriarchs, though dead, live in the promise of resurrection.", quote: "For like as Adam, although he lived on the day that he ate of the tree, died in the sentence: even so also these, although they had died, lived in the promise of the resurrection.", anchor: "For like as Adam", anchorEnd: "the promise of the resurrection" }
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
        { who: "Tertullian", work: "An Answer to the Jews", where: "Chapter 10", url: "https://www.newadvent.org/fathers/0308.htm", about: "Joseph, persecuted and sold by his brothers, as a figure of Christ's passion", summary: "Tertullian presents Joseph as a figure of Christ, persecuted by his brothers and sold into Egypt, as Christ was betrayed by his own.", quote: "Joseph, again, himself was made a figure of Christ in this point alone (to name no more, not to delay my own course), that he suffered persecution at the hands of his brethren, and was sold into Egypt, on account of the favour of God", anchor: "himself was made a figure of Christ", anchorEnd: "on account of the favour of God" },
        { who: "John Chrysostom", work: "Homilies on Romans", where: "Homily 15 (Rom 8:28-39)", url: "https://www.newadvent.org/fathers/210215.htm", about: "Homily on 'all things work together for good to them that love God'", summary: "Chrysostom says Paul's 'all things' includes painful ones: tribulation, poverty, prison, famine, even death, all of which God can turn into their opposite.", quote: "Now when he speaks of 'all things,' he mentions even the things that seem painful. For should even tribulation, or poverty, or imprisonment, or famines, or deaths, or anything else whatsoever come upon us, God is able to change all these things into the opposite.", anchor: "Now when he speaks of", anchorEnd: "all these things into the opposite" },
        { who: "Augustine", work: "Enchiridion", where: "Chapter 11", url: "https://www.newadvent.org/fathers/1302.htm", about: "God, being good and almighty, able to bring good even out of evil", summary: "Augustine argues that a supremely good and almighty God would never permit evil unless he were able to bring good even out of evil.", quote: "For the Almighty God, who, as even the heathen acknowledge, has supreme power over all things, being Himself supremely good, would never permit the existence of anything evil among His works, if He were not so omnipotent and good that He can bring good even out of evil.", anchor: "For the Almighty God", anchorEnd: "good even out of evil" }
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
        { who: "Augustine", work: "Tractates on the Gospel of John", where: "Tractate 4 (John 1:19-33)", url: "https://www.newadvent.org/fathers/1701004.htm", about: "How John could deny being Elijah while Christ calls him Elijah", summary: "Augustine explains that John was to Christ's first coming what Elijah will be to the second: two comings of the Judge, two heralds.", quote: "And what John was to the first advent, that will Elias be to the second advent. As there are two advents of the Judge, so are there two heralds.", anchor: "And what John was to the first advent", anchorEnd: "so are there two heralds" },
        { who: "Justin Martyr", work: "Dialogue with Trypho", where: "Chapters 49-51", url: "https://www.newadvent.org/fathers/01284.htm", about: "Elijah's coming and John as forerunner of Christ's first advent", summary: "Justin says Elijah will come before Christ's glorious return, while at Christ's first coming the Spirit who was in Elijah went before him as herald in John.", quote: "And we know that this shall take place when our Lord Jesus Christ shall come in glory from heaven; whose first manifestation the Spirit of God who was in Elijah preceded as herald in [the person of] John, a prophet among your nation; after whom no other prophet appeared among you.", anchor: "And we know that this shall take place", anchorEnd: "no other prophet appeared among you" },
        { who: "John Chrysostom", work: "Homilies on Matthew", where: "Homily 37 (Matt 11:7ff.)", url: "https://www.newadvent.org/fathers/200137.htm", about: "Homily on 'if ye will receive it, this is Elias'", summary: "Chrysostom says Christ's words show that John is Elijah and Elijah is John, since both shared one ministry as forerunners.", quote: "And this He said, as requiring a candid mind, and showing that John is Elias, and Elias John. For both of them received one ministry, and both of them became forerunners.", anchor: "as requiring a candid mind", anchorEnd: "both of them became forerunners" }
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
        { who: "Justin Martyr", work: "Dialogue with Trypho", where: "Chapter 11", url: "https://www.newadvent.org/fathers/01282.htm", about: "The new covenant promised by God, citing Jeremiah", summary: "Justin argues that a later law and covenant end the earlier one, and that Christ himself is the eternal and final law given to Christians.", quote: "Now, law placed against law has abrogated that which is before it, and a covenant which comes after in like manner has put an end to the previous one; and an eternal and final law — namely, Christ — has been given to us, and the covenant is trustworthy, after which there shall be no law, no commandment, no ordinance.", anchor: "law placed against law has abrogated", anchorEnd: "which there shall be no law" },
        { who: "John Chrysostom", work: "Homilies on Hebrews", where: "Homily 14 (Heb 8:1-13)", url: "https://www.newadvent.org/fathers/240214.htm", about: "Homily on Jeremiah's new covenant and laws written on hearts", summary: "Chrysostom says the new covenant was fulfilled when the apostles received it not in writing but in their hearts through the Holy Spirit.", quote: "But I show that the Apostles received nothing in writing, but received it in their hearts through the Holy Ghost.", anchor: "But I show that the Apostles", anchorEnd: "through the Holy Ghost" }
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
        { who: "Justin Martyr", work: "Dialogue with Trypho", where: "Chapters 98-106", url: "https://www.newadvent.org/fathers/01287.htm", about: "Verse-by-verse reading of Psalm 22 as predicting Christ's passion and resurrection", summary: "Justin undertakes to show the whole psalm refers to Christ, saying its opening cry of forsakenness announced what would be said in Christ's time.", quote: "Now I will demonstrate to you that the whole Psalm refers thus to Christ, by the words which I shall again explain. What is said at first—'O God, my God, attend to me: why have You forsaken me?'— announced from the beginning that which was to be said in the time of Christ.", anchor: "Now I will demonstrate to you that", anchorEnd: "in the time of Christ" },
        { who: "John Chrysostom", work: "Homilies on Matthew", where: "Homily 88 (Matt 27:45-48)", url: "https://www.newadvent.org/fathers/200188.htm", about: "Homily on Jesus' cry 'Eli, Eli, lama sabachthani'", summary: "Chrysostom says Jesus cried out in the prophet's words, in Hebrew, bearing witness to the Old Testament to the end and showing his oneness with the Father.", quote: "Wherefore also He uttered a certain cry from the prophet, even to His last hour bearing witness to the Old Testament, and not simply a cry from the prophet, but also in Hebrew, so as to be plain and intelligible to them, and by all things He shows how He is of one mind with Him that begot Him.", anchor: "Wherefore also He uttered a certain cry", anchorEnd: "with Him that begot Him" }
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
        { who: "John Chrysostom", work: "Homilies on the Gospel of John", where: "Homily 76 (John 14:31-15:10)", url: "https://www.newadvent.org/fathers/240176.htm", about: "Homily on the true vine, the branches, and abiding in Christ", summary: "Chrysostom notes that in the vine image the Son cares for the disciples no less than the Father: the Father prunes, while the Son keeps them in himself.", quote: "Do you see that the Son contributes not less than the Father towards the care of the disciples? The Father purges, but He keeps them in Himself.", anchor: "Do you see that the Son contributes", anchorEnd: "keeps them in Himself" },
        { who: "Cyril of Alexandria", work: "Commentary on John", where: "Book 10 (John 15:1ff.)", url: "https://www.tertullian.org/fathers/cyril_on_john_10_book10.htm", about: "Commentary on 'I am the true Vine' and the Father as husbandman", summary: "Cyril says Christ is the vine and believers are branches who depend on him, enriched by his grace and drawing power from the Spirit to bear fruit.", quote: "I think, therefore, we ought to take this view and no other, that Christ takes the place of the vine, and we are dependent on Him as branches, enriched as it were by His grace, and drinking in by the Spirit spiritual power to bear fruit.", anchor: "Christ takes the place of the vine", anchorEnd: "spiritual power to bear fruit" },
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 4, Chapter 36", url: "https://www.newadvent.org/fathers/0103436.htm", about: "The parable of God's vineyard across the Mosaic and Christian dispensations", summary: "Irenaeus argues that one and the same Father planted the vineyard, led out the people, sent the prophets and his Son, and gave the vineyard to new husbandmen.", quote: "It is therefore one and the same Father who planted the vineyard, who led forth the people, who sent the prophets, who sent His own Son, and who gave the vineyard to those other husbandmen that render the fruits in their season.", anchor: "It is therefore one and the same Father", anchorEnd: "the fruits in their season" }
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
        { who: "John Chrysostom", work: "Homilies on Ephesians", where: "Homily 20 (Eph 5:22-33)", url: "https://www.newadvent.org/fathers/230120.htm", about: "Homily on marriage and the 'great mystery' of Christ and the Church", summary: "Chrysostom explains that the great mystery is that Christ left the Father, came down to his Bride the Church, and became one Spirit with her.", quote: "Why does he call it a great mystery? That it was something great and wonderful, the blessed Moses, or rather God, intimated. For the present, however, says he, I speak regarding Christ, that having left the Father, He came down, and came to the Bride, and became one Spirit.", anchor: "Why does he call it a great mystery", anchorEnd: "and became one Spirit" },
        { who: "Methodius of Olympus", work: "Banquet of the Ten Virgins", where: "Discourse 3, Chapters 1 and 8", url: "https://www.newadvent.org/fathers/062303.htm", about: "Adam and Eve read with Ephesians 5 as Christ and the Church", summary: "Methodius says the apostle applied to Christ the words originally spoken about Adam.", quote: "Whence it was that the apostle directly referred to Christ the words which had been spoken of Adam.", anchor: "Whence it was that the apostle", anchorEnd: "had been spoken of Adam" }
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
        { who: "John Chrysostom", work: "Homilies on First Thessalonians", where: "Homily 9 (1 Thess 5:1-11)", url: "https://www.newadvent.org/fathers/230409.htm", about: "Homily on the day of the Lord as a thief; watchfulness and sobriety", summary: "Chrysostom says Christ comes like a thief in the night so that we will not give ourselves to wickedness or sloth and lose our reward.", quote: "On this account He so comes as a thief in the night; that we may not abandon ourselves to wickedness, nor to sloth; that He may not take from us our reward.", anchor: "On this account He so comes", anchorEnd: "not take from us our reward" },
        { who: "Cyril of Jerusalem", work: "Catechetical Lectures", where: "Lecture 15", url: "https://www.newadvent.org/fathers/310115.htm", about: "Lecture on Christ's coming in glory to judge, citing 1 Thessalonians 4", summary: "Cyril proclaims a second coming of Christ far more glorious than the first, bringing the crown of a divine kingdom rather than a display of patience.", quote: "We preach not one advent only of Christ, but a second also, far more glorious than the former. For the former gave a view of His patience; but the latter brings with it the crown of a divine kingdom.", anchor: "We preach not one advent only", anchorEnd: "crown of a divine kingdom" },
        { who: "Early Church", work: "The Didache (Teaching of the Twelve Apostles)", where: "Chapter 16", url: "https://www.newadvent.org/fathers/0714.htm", about: "Watchfulness and readiness for the Lord's coming", summary: "The Didache urges readiness for the Lord's unknown hour and frequent gathering for the soul's good, since faith profits only if one is perfected at the end.", quote: "Let not your lamps be quenched, nor your loins unloosed; but be ready, for you know not the hour in which our Lord comes. But often shall you come together, seeking the things which are befitting to your souls: for the whole time of your faith will not profit you, if you be not made perfect in the last time.", anchor: "Let not your lamps be quenched", anchorEnd: "perfect in the last time" }
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
        { who: "Cyprian of Carthage", work: "On the Lord's Prayer (Treatise 4)", where: "Section 12", url: "https://www.newadvent.org/fathers/050704.htm", about: "On 'Hallowed be thy name' and daily sanctification; cites 'Be holy'", summary: "Cyprian says that, having been sanctified in baptism, Christians pray daily to be made holy, because they fall daily and need continual sanctification.", quote: "And this we daily pray for; for we have need of daily sanctification, that we who daily fall away may wash out our sins by continual sanctification.", anchor: "And this we daily pray for", anchorEnd: "by continual sanctification" },
        { who: "Clement of Rome", work: "First Epistle to the Corinthians (1 Clement)", where: "Chapter 30", url: "https://www.newadvent.org/fathers/1010.htm", about: "As the portion of the Holy One, do all that pertains to holiness", summary: "Clement urges that since Christians are the Holy One's portion, they must do everything belonging to holiness and shun evil speech, impurity, drunkenness, lust, adultery, and pride.", quote: "Seeing, therefore, that we are the portion of the Holy One, let us do all those things which pertain to holiness, avoiding all evil-speaking, all abominable and impure embraces, together with all drunkenness, seeking after change, all abominable lusts, detestable adultery, and execrable pride.", anchor: "that we are the portion of the Holy One", anchorEnd: "and execrable pride" }
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
        { who: "Origen", work: "Against Celsus", where: "Book 2, ch. 20", url: "https://www.newadvent.org/fathers/04162.htm", about: "Whether God's foreknowledge of Judas's betrayal causes it; foreknowledge versus necessity", summary: "Origen argues against Celsus that foreknowing an event does not cause it; the event would happen anyway and simply gives the foreknower occasion to predict it.", quote: "Celsus imagines that an event, predicted through foreknowledge, comes to pass because it was predicted; but we do not grant this, maintaining that he who foretold it was not the cause of its happening, because he foretold it would happen; but the future event itself, which would have taken place though not predicted, afforded the occasion to him, who was endowed with foreknowledge, of foretelling its occurrence.", anchor: "Celsus imagines that an event", anchorEnd: "of foretelling its occurrence" },
        { who: "Augustine", work: "City of God", where: "Book 5, chs. 9–10", url: "https://www.newadvent.org/fathers/120105.htm", about: "Answers Cicero's claim that divine foreknowledge rules out free will", summary: "Augustine affirms both that God knows all things before they happen and that we freely do whatever we know we do only because we will it.", quote: "Now, against the sacrilegious and impious darings of reason, we assert both that God knows all things before they come to pass, and that we do by our free will whatsoever we know and feel to be done by us only because we will it.", anchor: "against the sacrilegious and impious darings of", anchorEnd: "only because we will it" },
        { who: "Justin Martyr", work: "First Apology", where: "ch. 43", url: "https://www.newadvent.org/fathers/0126.htm", about: "Prophecy and foreknowledge set alongside human responsibility and free choice", summary: "Justin argues that because rewards and punishments follow each person's deeds, all things cannot be fated, or nothing would be in our power.", quote: "We have learned from the prophets, and we hold it to be true, that punishments, and chastisements, and good rewards, are rendered according to the merit of each man's actions. Since if it be not so, but all things happen by fate, neither is anything at all in our own power.", anchor: "We have learned from the prophets", anchorEnd: "at all in our own power" }
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
        { who: "Athanasius", work: "Against the Heathen", where: "chs. 6–7", url: "https://www.newadvent.org/fathers/2801.htm", about: "Rejects evil as a substance; locates its origin in the soul's perverted choice", summary: "Athanasius says the Church's teaching is that evil was not from the beginning with God or in God.", quote: "This conceit of theirs, then, being evidently rotten, the truth of the Church's theology must be manifest: that evil has not from the beginning been with God or in God", anchor: "This conceit of theirs", anchorEnd: "with God or in God" },
        { who: "Gregory of Nyssa", work: "The Great Catechism", where: "chs. 5–6", url: "https://www.ccel.org/ccel/schaff/npnf205.xi.ii.viii.html", about: "Evil arising from free will, described as absence of good rather than a thing", summary: "Gregory of Nyssa says vice has no natural existence of its own but is the deprivation of goodness, as blindness is lack of sight or shadow the absence of light.", quote: "As we say that blindness is logically opposed to sight, not that blindness has of itself a natural existence, being only a deprivation of a preceding faculty, so also we say that vice is to be regarded as the deprivation of goodness, just as a shadow which supervenes at the passage of the solar ray.", anchor: "As we say that blindness is logically opposed", anchorEnd: "passage of the solar ray" },
        { who: "Augustine", work: "Confessions", where: "Book 7, chs. 12–16", url: "https://www.newadvent.org/fathers/110107.htm", about: "His search for where evil comes from; evil not a substance but perverted will", summary: "Augustine concludes that iniquity is not a substance but a perversion of the will, turning away from God, the Supreme Substance, toward lower things.", quote: "And I inquired what iniquity was, and ascertained it not to be a substance, but a perversion of the will, bent aside from You, O God, the Supreme Substance, towards these lower things, and casting out its bowels, and swelling outwardly.", anchor: "And I inquired what iniquity was", anchorEnd: "and swelling outwardly" }
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
        { who: "Gregory of Nyssa", work: "On \"Not Three Gods\" (to Ablabius)", where: "", url: "https://www.newadvent.org/fathers/2905.htm", about: "Why three divine Persons sharing one nature are not called three Gods", summary: "Gregory of Nyssa holds that Father and Son are each God, yet God is one, because there is no difference of nature or operation in the Godhead.", quote: "The Father is God: the Son is God: and yet by the same proclamation God is One, because no difference either of nature or of operation is contemplated in the Godhead.", anchor: "and yet by the same proclamation God", anchorEnd: "contemplated in the Godhead" },
        { who: "Basil of Caesarea", work: "Letter 38 (to his brother Gregory)", where: "", url: "https://www.newadvent.org/fathers/3202038.htm", about: "Distinguishes ousia (common essence) from hypostasis (Person) in the Trinity", summary: "Basil tells his reader to apply the human distinction between common essence and individual hypostasis to God, thinking of Father, Son and Spirit alike.", quote: "Transfer, then, to the divine dogmas the same standard of difference which you recognise in the case both of essence and of hypostasis in human affairs, and you will not go wrong. Whatever your thought suggests to you as to the mode of the existence of the Father, you will think also in the case of the Son, and in like manner too of the Holy Ghost.", anchor: "to the divine dogmas the same standard", anchorEnd: "too of the Holy Ghost" },
        { who: "Tertullian", work: "Against Praxeas", where: "chs. 2–3", url: "https://www.newadvent.org/fathers/0317.htm", about: "Against modalism: one God in three Persons without destroying the divine monarchy", summary: "Tertullian says the three differ in degree, form, and aspect, not in condition, substance, or power, being one God named Father, Son, and Holy Ghost.", quote: "three, however, not in condition, but in degree; not in substance, but in form; not in power, but in aspect; yet of one substance, and of one condition, and of one power, inasmuch as He is one God, from whom these degrees and forms and aspects are reckoned, under the name of the Father, and of the Son, and of the Holy Ghost.", anchor: "inasmuch as He is one God", anchorEnd: "and of the Holy Ghost" }
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
        { who: "Augustine", work: "City of God", where: "Book 15, ch. 25", url: "https://www.ccel.org/ccel/schaff/npnf102.iv.XV.25.html", about: "How Scripture's language of God's anger and repenting fits an unchanging God", summary: "Augustine says God's anger is not an emotion but just judgment, and his 'repenting' is unchangeable reason changing things, since God never regrets like humans.", quote: "The anger of God is not a disturbing emotion of His mind, but a judgment by which punishment is inflicted upon sin. His thought and reconsideration also are the unchangeable reason which changes things; for He does not, like man, repent of anything He has done, because in all matters His decision is as inflexible as His prescience is certain.", anchor: "The anger of God is not", anchorEnd: "His prescience is certain" },
        { who: "Novatian", work: "On the Trinity", where: "ch. 5", url: "https://www.newadvent.org/fathers/0511.htm", about: "How to read God's anger and hatred in Scripture without ascribing human vices", summary: "Novatian says God's anger comes from no vice in him but is for our benefit: he is merciful even in threatening, to call people back to righteousness.", quote: "For that God is angry, arises from no vice in Him. But He is so for our advantage; for He is merciful even then when He threatens, because by these threats men are recalled to rectitude.", anchor: "For that God is angry", anchorEnd: "men are recalled to rectitude" },
        { who: "Lactantius", work: "On the Anger of God", where: "", url: "https://www.newadvent.org/fathers/0703.htm", about: "Argues against philosophers that God is truly angry with wickedness", summary: "Lactantius argues that if God were not angry with the wicked, it would follow that he does not love the righteous.", quote: "For if God is not angry with the impious and the unrighteous, it is clear that He does not love the pious and the righteous.", anchor: "For if God is not angry with", anchorEnd: "the pious and the righteous" }
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
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 3, ch. 18", url: "https://www.newadvent.org/fathers/0103318.htm", about: "Why the Mediator had to be both truly God and truly man to save", summary: "Irenaeus argues that a man had to defeat humanity's enemy, God had to grant salvation for it to be secure, and humanity had to be joined to God.", quote: "For unless man had overcome the enemy of man, the enemy would not have been legitimately vanquished. And again: unless it had been God who had freely given salvation, we could never have possessed it securely. And unless man had been joined to God, he could never have become a partaker of incorruptibility.", anchor: "For unless man had overcome the enemy", anchorEnd: "partaker of incorruptibility" },
        { who: "Gregory of Nazianzus", work: "Letter 101 (to Cledonius)", where: "", url: "https://www.newadvent.org/fathers/3103a.htm", about: "Against Apollinarius: Christ assumed a full human mind; the unassumed is unhealed", summary: "Gregory argues against Apollinarius that Christ must have a human mind, because what Christ has not assumed he has not healed.", quote: "If anyone has put his trust in Him as a Man without a human mind, he is really bereft of mind, and quite unworthy of salvation. For that which He has not assumed He has not healed; but that which is united to His Godhead is also saved.", anchor: "If anyone has put his trust", anchorEnd: "Godhead is also saved" },
        { who: "Athanasius", work: "Letter 59 (to Epictetus)", where: "", url: "https://www.newadvent.org/fathers/2806059.htm", about: "Defends the true humanity of Christ's body from Mary, not changed into Godhead", summary: "Athanasius says the Word became flesh not by changing into flesh but by taking real living flesh on our behalf and becoming man.", quote: "And just as He has not Himself become a curse, but is said to have done so because He took upon Him the curse on our behalf, so also He has become flesh not by being changed into flesh, but because He assumed on our behalf living flesh, and has become Man.", anchor: "And just as He has not Himself become", anchorEnd: "and has become Man" }
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
        { who: "Justin Martyr", work: "First Apology", where: "ch. 66", url: "https://www.ccel.org/ccel/schaff/anf01.viii.ii.lxvi.html", about: "Early description of the Eucharist received as Christ's flesh and blood", summary: "Justin says Christians receive the blessed food not as common bread and drink, but, as they have been taught, as the flesh and blood of the incarnate Jesus.", quote: "For not as common bread and common drink do we receive these; but in like manner as Jesus Christ our Saviour, having been made flesh by the Word of God, had both flesh and blood for our salvation, so likewise have we been taught that the food which is blessed by the prayer of His word, and from which our blood and flesh by transmutation are nourished, is the flesh and blood of that Jesus who was made flesh.", anchor: "For not as common bread and common drink", anchorEnd: "Jesus who was made flesh" },
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 22 (Mystagogical 4)", where: "", url: "https://www.newadvent.org/fathers/310122.htm", about: "Teaching new believers that the bread and wine are Christ's body and blood", summary: "Cyril tells new believers not to regard the bread and wine as mere elements but, trusting the Lord's word over taste, as Christ's Body and Blood.", quote: "Consider therefore the Bread and the Wine not as bare elements, for they are, according to the Lord's declaration, the Body and Blood of Christ; for even though sense suggests this to you, yet let faith establish you. Judge not the matter from the taste, but from faith be fully assured without misgiving, that the Body and Blood of Christ have been vouchsafed to you.", anchor: "Consider therefore the Bread and the Wine", anchorEnd: "have been vouchsafed to you" },
        { who: "Augustine", work: "Tractates on the Gospel of John", where: "Tractate 26", url: "https://www.newadvent.org/fathers/1701026.htm", about: "On John 6: the sacrament versus its virtue; eating Christ's flesh by faith", summary: "Augustine distinguishes the visible sacrament from its virtue, warning that many receive at the altar yet die, since true eating is inward.", quote: "For even we at this day receive visible food: but the sacrament is one thing, the virtue of the sacrament another.", anchor: "For even we at this day receive", anchorEnd: "virtue of the sacrament another" }
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
        { who: "Basil of Caesarea", work: "Letter 234", where: "", url: "https://www.newadvent.org/fathers/3202234.htm", about: "Whether we know God's essence or know him through his operations", summary: "Basil says God's operations reach us, but his essence remains beyond our reach.", quote: "His operations come down to us, but His essence remains beyond our reach.", anchor: "His operations come down to us", anchorEnd: "remains beyond our reach" },
        { who: "Augustine", work: "On Christian Doctrine", where: "Book 1, chs. 6–7", url: "https://www.newadvent.org/fathers/12021.htm", about: "In what sense God is unspeakable, yet still rightly spoken of", summary: "Augustine says nothing worthy of God's greatness can be spoken, yet God has stooped to accept human words of worship and wants us to praise him through them.", quote: "And this opposition of words is rather to be avoided by silence than to be explained away by speech. And yet God, although nothing worthy of His greatness can be said of Him, has condescended to accept the worship of men's mouths, and has desired us through the medium of our own words to rejoice in His praise.", anchor: "And this opposition of words is", anchorEnd: "to rejoice in His praise" },
        { who: "John of Damascus", work: "An Exact Exposition of the Orthodox Faith", where: "Book 1, ch. 4", url: "https://www.newadvent.org/fathers/33041.htm", about: "That the divine nature is incomprehensible; what our names for God signify", summary: "John of Damascus says God is infinite and incomprehensible, and what we affirm about him shows not his nature itself but only qualities of his nature.", quote: "God then is infinite and incomprehensible and all that is comprehensible about Him is His infinity and incomprehensibility. But all that we can affirm concerning God does not show forth God's nature, but only the qualities of His nature.", anchor: "God then is infinite and incomprehensible", anchorEnd: "the qualities of His nature" }
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
        { who: "Augustine", work: "Tractates on the Gospel of John", where: "Tractate 29", url: "https://www.newadvent.org/fathers/1701029.htm", about: "On John 7:17 and Isaiah 7:9: believing in order to understand", summary: "Augustine advises not to seek understanding in order to believe, but to believe in order to understand, citing Isaiah's 'unless you believe, you shall not understand.'", quote: "Therefore do not seek to understand in order to believe, but believe that you may understand; since, 'except ye believe, you shall not understand.'", anchor: "Therefore do not seek to understand in", anchorEnd: "you shall not understand" },
        { who: "Tertullian", work: "The Prescription Against Heretics", where: "ch. 7", url: "https://www.newadvent.org/fathers/0311.htm", about: "\"What has Athens to do with Jerusalem?\": suspicion of philosophy as a source of heresy", summary: "Tertullian asks what Athens has to do with Jerusalem, rejecting any blending of pagan philosophy with the Church's faith.", quote: "What indeed has Athens to do with Jerusalem? What concord is there between the Academy and the Church? What between heretics and Christians?", anchor: "What indeed has Athens to do with Jerusalem", anchorEnd: "between heretics and Christians" },
        { who: "Clement of Alexandria", work: "Stromata", where: "Book 1, ch. 5", url: "https://www.newadvent.org/fathers/02101.htm", about: "Philosophy as a preparation leading the Greeks toward Christ", summary: "Clement says philosophy, once necessary to the Greeks for righteousness, now serves piety as a preparatory training for those who come to faith through demonstration.", quote: "And now it becomes conducive to piety; being a kind of preparatory training to those who attain to faith through demonstration.", anchor: "And now it becomes conducive to piety", anchorEnd: "attain to faith through demonstration" }
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
        { who: "Gregory of Nyssa", work: "The Great Catechism", where: "chs. 21–26", url: "https://www.ccel.org/ccel/schaff/npnf205.xi.ii.xxvi.html", about: "The ransom given for humanity and the outwitting of the devil", summary: "Gregory of Nyssa says the Deity was hidden in human flesh so the devil would accept the ransom, swallowing the hook of divinity with the bait of flesh.", quote: "in order to secure that the ransom in our behalf might be easily accepted by him who required it, the Deity was hidden under the veil of our nature, that so, as with ravenous fish, the hook of the Deity might be gulped down along with the bait of flesh", anchor: "in order to secure that the ransom", anchorEnd: "along with the bait of flesh" },
        { who: "Gregory of Nazianzus", work: "Oration 45 (Second Oration on Easter)", where: "sec. 22", url: "https://www.newadvent.org/fathers/310245.htm", about: "Asks to whom Christ's blood was paid, rejecting both devil and Father as payee", summary: "Gregory asks to whom Christ's blood was paid as a ransom and indignantly rejects the idea that it was paid to the Evil One.", quote: "Now, since a ransom belongs only to him who holds in bondage, I ask to whom was this offered, and for what cause? If to the Evil One, fie upon the outrage!", anchor: "since a ransom belongs only to him", anchorEnd: "fie upon the outrage" },
        { who: "Augustine", work: "Reply to Faustus the Manichaean", where: "Book 14", url: "https://www.newadvent.org/fathers/140614.htm", about: "Christ bearing the curse and our punishment though himself without guilt", summary: "Augustine says Christ, though guiltless, took our punishment in order to cancel our guilt and do away with our punishment.", quote: "Christ, though guiltless, took our punishment, that He might cancel our guilt, and do away with our punishment.", anchor: "that He might cancel our guilt", anchorEnd: "do away with our punishment" }
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
        { who: "Augustine", work: "City of God", where: "Book 11, chs. 6 and 21", url: "https://www.newadvent.org/fathers/120111.htm", about: "World and time begun together; God's eternal, unchanging knowledge and will", summary: "Augustine says God does not move from thought to thought but sees all things unchangeably, holding past, present, and future in his stable and eternal presence.", quote: "For He does not pass from this to that by transition of thought, but beholds all things with absolute unchangeableness; so that of those things which emerge in time, the future, indeed, are not yet, and the present are now, and the past no longer are; but all of these are by Him comprehended in His stable and eternal presence.", anchor: "For He does not pass from this", anchorEnd: "His stable and eternal presence" },
        { who: "John of Damascus", work: "An Exact Exposition of the Orthodox Faith", where: "Book 2, ch. 1", url: "https://www.newadvent.org/fathers/33042.htm", about: "On aeon/age and time, and God as existing before and making the ages", summary: "John of Damascus says God created the ages and was himself before them, citing David's 'From age to age You are.'", quote: "He created the ages Who Himself was before the ages, Whom the divine David thus addresses, From age to age You are.", anchor: "He created the ages Who Himself", anchorEnd: "From age to age You are" }
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
        { who: "Origen", work: "On First Principles (De Principiis)", where: "Book 3, ch. 1", url: "https://www.newadvent.org/fathers/04123.htm", about: "Defends free will; reads Pharaoh's hardening and Romans 9's potter and vessels", summary: "Origen illustrates Pharaoh's hardening: as one sun melts wax but hardens mud, God's single action has different effects because of differing qualities in those it acts on.", quote: "Now it is not incorrect to say that the sun, by one and the same power of its heat, melts wax indeed, but dries up and hardens mud: not that its power operates one way upon mud, and in another way upon wax; but that the qualities of mud and wax are different, although according to nature they are one thing, both being from the earth.", anchor: "Now it is not incorrect to say", anchorEnd: "both being from the earth" },
        { who: "John Chrysostom", work: "Homilies on Romans", where: "Homily 15 (Rom 8:28–39)", url: "https://www.newadvent.org/fathers/210215.htm", about: "\"Called according to his purpose\": calling, foreknowledge, and the hearer's response", summary: "Chrysostom says calling alone does not save, otherwise all would be saved; the purpose of those called also matters, since the call is not compulsory.", quote: "For if the calling alone were sufficient, how came it that all were not saved? Hence he says, that it is not the calling alone, but the purpose of those called too, that works the salvation. For the calling was not forced upon them, nor compulsory.", anchor: "For if the calling alone were sufficient", anchorEnd: "was not forced upon them" },
        { who: "John Cassian", work: "Conferences", where: "Conference 13 (Abbot Chaeremon), chs. 8–18", url: "https://www.newadvent.org/fathers/350813.htm", about: "Whether God's grace precedes or follows the beginning of a good will", summary: "Cassian, through Abbot Chaeremon, teaches that God sometimes waits for our will to move first, and when he finds us unwilling, stirs our hearts to renew or form a good will.", quote: "And again, if He finds that we are unwilling or have grown cold, He stirs our hearts with salutary exhortations, by which a good will is either renewed or formed in us.", anchor: "if He finds that we are unwilling", anchorEnd: "renewed or formed in us" }
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
        { who: "Augustine", work: "On Rebuke and Grace", where: "chs. 10–16, 20", url: "https://www.newadvent.org/fathers/1513.htm", about: "Perseverance as God's gift; those who fall away versus the elect", summary: "Augustine teaches that perseverance in good to the end is God's gift, given only to those who will not perish, while those who do not persevere perish.", quote: "From Him, therefore, is given also perseverance in good even to the end; for it is not given save to those who shall not perish, since they who do not persevere shall perish.", anchor: "is given also perseverance in good even", anchorEnd: "do not persevere shall perish" },
        { who: "John Chrysostom", work: "Homilies on Hebrews", where: "Homily 9 (Heb 6:1–6)", url: "https://www.newadvent.org/fathers/240209.htm", about: "Reads Hebrews 6:4–6 as ruling out a second baptism, not repentance", summary: "Chrysostom insists that while there is no second baptism, repentance remains and has great power to free even the deeply fallen baptized sinner from his sins.", quote: "Is there no repentance? There is repentance, but there is no second baptism: but repentance there is, and it has great force, and is able to set free from the burden of his sins, if he will, even him that has been baptized much in sins, and to establish in safety him who is in danger, even though he should have come unto the very depth of wickedness.", anchor: "Is there no repentance", anchorEnd: "the very depth of wickedness" }
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
        { who: "Justin Martyr", work: "First Apology", where: "ch. 8", url: "https://www.ccel.org/ccel/schaff/anf01.viii.ii.viii.html", about: "Everlasting punishment of the wicked, contrasted with Plato's thousand-year period", summary: "Justin says Christ will punish the wicked, reunited with their bodies, with everlasting punishment, not merely for a thousand-year period as Plato said.", quote: "And Plato, in like manner, used to say that Rhadamanthus and Minos would punish the wicked who came before them; and we say that the same thing will be done, but at the hand of Christ, and upon the wicked in the same bodies united again to their spirits which are now to undergo everlasting punishment; and not only, as Plato said, for a period of a thousand years.", anchor: "used to say that Rhadamanthus and Minos", anchorEnd: "period of a thousand years" },
        { who: "Arnobius", work: "Against the Heathen", where: "Book 2, ch. 14", url: "https://www.newadvent.org/fathers/06312.htm", about: "Souls not immortal by nature; the wicked pass into final destruction", summary: "Arnobius says souls are of an intermediate nature: those who do not know God are annihilated in everlasting destruction, while those who heed him are delivered from death.", quote: "For they are cast in, and being annihilated, pass away vainly in everlasting destruction. For theirs is an intermediate state, as has been learned from Christ's teaching; and they are such that they may on the one hand perish if they have not known God, and on the other be delivered from death if they have given heed to His threats and proffered favours.", anchor: "For they are cast in", anchorEnd: "His threats and proffered favours" },
        { who: "Gregory of Nyssa", work: "The Great Catechism", where: "ch. 26", url: "https://www.ccel.org/ccel/schaff/npnf205.xi.ii.xxviii.html", about: "Hope that evil is finally purged, even from the adversary himself", summary: "Gregory of Nyssa says that by passing through every stage of human life, even death, Christ freed humanity from evil and healed even the one who introduced evil.", quote: "For in those points in which He was mingled with humanity, passing as He did through all the accidents proper to human nature, such as birth, rearing, growing up, and advancing even to the taste of death, He accomplished all the results before mentioned, freeing both man from evil, and healing even the introducer of evil himself.", anchor: "For in those points in which He", anchorEnd: "the introducer of evil himself" }
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
        { who: "John Chrysostom", work: "Homilies on Matthew", where: "Homily 1, secs. 5–6", url: "https://www.newadvent.org/fathers/200101.htm", about: "Why four Gospels, and how minor differences between them attest their truth", summary: "Chrysostom argues that if the Gospels agreed in every detail, enemies would suspect collusion; their small differences instead clear the writers of suspicion and attest their honesty.", quote: "For if they had agreed in all things exactly even to time, and place, and to the very words, none of our enemies would have believed but that they had met together, and had written what they wrote by some human compact; because such entire agreement as this comes not of simplicity. But now even that discordance which seems to exist in little matters delivers them from all suspicion, and speaks clearly in behalf of the character of the writers.", anchor: "For if they had agreed in all things", anchorEnd: "the character of the writers" },
        { who: "Origen", work: "On First Principles (De Principiis)", where: "Book 4", url: "https://www.newadvent.org/fathers/04124.htm", about: "Inspiration of Scripture and the purpose of its difficulties and impossibilities", summary: "Origen says the Holy Spirit arranged surface difficulties in Scripture so that readers would search for a deeper truth and a meaning worthy of God.", quote: "Now all this, as we have remarked, was done by the Holy Spirit in order that, seeing those events which lie on the surface can be neither true nor useful, we may be led to the investigation of that truth which is more deeply concealed, and to the ascertaining of a meaning worthy of God in those Scriptures which we believe to be inspired by Him.", anchor: "was done by the Holy Spirit", anchorEnd: "believe to be inspired by Him" }
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
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 4", where: "sec. 17", url: "https://www.newadvent.org/fathers/310104.htm", about: "Tells hearers to accept his teaching only with proof from the Scriptures", summary: "Cyril insists that nothing about the mysteries of the faith be taught without the Holy Scriptures, and tells hearers not to believe even him without scriptural proof.", quote: "For concerning the divine and holy mysteries of the Faith, not even a casual statement must be delivered without the Holy Scriptures; nor must we be drawn aside by mere plausibility and artifices of speech. Even to me, who tell you these things, give not absolute credence, unless thou receive the proof of the things which I announce from the Divine Scriptures.", anchor: "For concerning the divine and holy mysteries", anchorEnd: "announce from the Divine Scriptures" },
        { who: "Tertullian", work: "The Prescription Against Heretics", where: "chs. 19–21", url: "https://www.newadvent.org/fathers/0311.htm", about: "Rule of faith and apostolic churches as the test, rather than arguing from Scripture alone", summary: "Tertullian argues that disputes with heretics should not be settled by arguing over Scripture, since such debates cannot produce a certain victory.", quote: "Our appeal, therefore, must not be made to the Scriptures; nor must controversy be admitted on points in which victory will either be impossible, or uncertain, or not certain enough.", anchor: "must not be made to the Scriptures", anchorEnd: "or not certain enough" },
        { who: "Athanasius", work: "Letter 39 (Festal Letter, AD 367)", where: "", url: "https://www.newadvent.org/fathers/2806039.htm", about: "Lists the canonical books as sufficient \"fountains of salvation\"", summary: "Athanasius calls the listed canonical books fountains of salvation, in which alone the doctrine of godliness is proclaimed, and forbids adding to or taking from them.", quote: "These are fountains of salvation, that they who thirst may be satisfied with the living words they contain. In these alone is proclaimed the doctrine of godliness. Let no man add to these, neither let him take ought from these.", anchor: "These are fountains of salvation", anchorEnd: "let him take ought from these" }
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
        { who: "Cyprian of Carthage", work: "Letter 58 (to Fidus)", where: "", url: "https://www.newadvent.org/fathers/050658.htm", about: "African bishops reject waiting until the eighth day to baptize infants", summary: "Cyprian reports that the council unanimously rejected delaying infant baptism to the eighth day, holding that God's mercy and grace should be refused to no one born.", quote: "For in this course which you thought was to be taken, no one agreed; but we all rather judge that the mercy and grace of God is not to be refused to any one born of man.", anchor: "For in this course which you thought", anchorEnd: "any one born of man" },
        { who: "Gregory of Nazianzus", work: "Oration 40 (On Holy Baptism)", where: "sec. 28", url: "https://www.newadvent.org/fathers/310240.htm", about: "Whether to baptize infants: at once if in danger, otherwise around age three", summary: "Gregory says children in danger of death should be baptized at once, since unknowing sanctification is better than dying unsealed; otherwise he advises waiting until about age three.", quote: "Certainly, if any danger presses. For it is better that they should be unconsciously sanctified than that they should depart unsealed and uninitiated.", anchor: "if any danger presses", anchorEnd: "unsealed and uninitiated" },
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 2, ch. 22, sec. 4", url: "https://www.newadvent.org/fathers/0103222.htm", about: "Christ came to save all ages born again to God, infants included", summary: "Irenaeus says Christ came to save all who through him are born again to God, naming infants, children, boys, youths, and old men.", quote: "For He came to save all through means of Himself — all, I say, who through Him are born again to God — infants, and children, and boys, and youths, and old men.", anchor: "For He came to save all", anchorEnd: "and old men" }
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
        { who: "Epiphanius of Salamis", work: "Letter to John of Jerusalem (Jerome, Letter 51)", where: "sec. 9", url: "https://www.newadvent.org/fathers/3001051.htm", about: "Tears down a church curtain bearing an image of Christ or a saint", summary: "Epiphanius says he tore down a church curtain bearing an image of Christ or a saint, judging such images contrary to Scripture's teaching. (Whether Epiphanius really wrote this passage was disputed at the Second Council of Nicaea in 787.)", quote: "It bore an image either of Christ or of one of the saints; I do not rightly remember whose the image was. Seeing this, and being loth that an image of a man should be hung up in Christ's church contrary to the teaching of the Scriptures, I tore it asunder and advised the custodians of the place to use it as a winding sheet for some poor person.", anchor: "It bore an image either of Christ", anchorEnd: "for some poor person" },
        { who: "Basil of Caesarea", work: "On the Holy Spirit", where: "ch. 18, sec. 45", url: "https://www.ccel.org/ccel/schaff/npnf208.vii.xix.html", about: "Honor paid to an image passes to its prototype (a Trinitarian argument later cited for icons)", summary: "Basil says the divine majesty and glory are undivided, so our worship is one, because honor paid to the image passes to its prototype.", quote: "The majesty is not cloven in two, nor the glory divided. The sovereignty and authority over us is one, and so the doxology ascribed by us is not plural but one; because the honour paid to the image passes on to the prototype.", anchor: "The majesty is not cloven in two", anchorEnd: "passes on to the prototype" },
        { who: "Gregory the Great", work: "Letter to Serenus of Marseilles", where: "Book 11, Letter 13", url: "https://www.newadvent.org/fathers/360211013.htm", about: "Rebukes a bishop for smashing images: pictures teach the unlettered, not to be adored", summary: "Gregory says pictures do for the unlearned what writing does for readers: in them the illiterate read what they ought to follow.", quote: "For what writing presents to readers, this a picture presents to the unlearned who behold, since in it even the ignorant see what they ought to follow; in it the illiterate read.", anchor: "For what writing presents to readers", anchorEnd: "in it the illiterate read" }
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
        { who: "John Cassian", work: "On the Incarnation of the Lord, Against Nestorius", where: "Book 2, ch. 2", url: "https://orthodoxchurchfathers.com/fathers/npnf211/npnf2189.html", about: "Argues Mary is Theotokos, not only Christotokos, because Christ is truly God", summary: "Cassian argues that since the Son of God cannot fail to be God, the one who bore him cannot fail to be Theotocos, Mother of God.", quote: "Ask now, if you like, how the Son of God can help being God, or how she who brought forth God can fail to be Theotocos, i.e., the Mother of God?", anchor: "the Son of God can help being God", anchorEnd: "the Mother of God" },
        { who: "Athanasius", work: "Discourses Against the Arians", where: "Discourse 3, sec. 29", url: "https://www.newadvent.org/fathers/28163.htm", about: "Calls Mary \"Bearer of God\" when summarizing the Word taking flesh", summary: "Athanasius says Scripture speaks of the Saviour in two ways: as eternally God and the Father's Word, and as later taking flesh from the Virgin Mary, Bearer of God.", quote: "Now the scope and character of Holy Scripture, as we have often said, is this — it contains a double account of the Saviour; that He was ever God, and is the Son, being the Father's Word and Radiance and Wisdom; and that afterwards for us He took flesh of a Virgin, Mary Bearer of God, and was made man.", anchor: "Now the scope and character of Holy Scripture", anchorEnd: "and was made man" },
        { who: "Gregory of Nazianzus", work: "Letter 101 (to Cledonius)", where: "", url: "https://www.newadvent.org/fathers/3103a.htm", about: "Makes confessing Mary as Mother of God a test of true faith in Christ", summary: "Gregory says that anyone who does not believe Holy Mary is the Mother of God is severed from the Godhead.", quote: "If anyone does not believe that Holy Mary is the Mother of God, he is severed from the Godhead.", anchor: "If anyone does not believe that", anchorEnd: "severed from the Godhead" }
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
        { who: "Augustine", work: "Tractates on the Gospel of John", where: "Tractate 24, sec. 1", url: "https://www.newadvent.org/fathers/1701024.htm", about: "Daily governance of the world as a greater wonder than miracles, which are rare", summary: "Augustine says governing the whole world is a greater miracle than feeding five thousand with five loaves, yet people marvel at the latter only because it is rare.", quote: "For certainly the government of the whole world is a greater miracle than the satisfying of five thousand men with five loaves; and yet no man wonders at the former; but the latter men wonder at, not because it is greater, but because it is rare.", anchor: "For certainly the government of the whole world", anchorEnd: "because it is rare" },
        { who: "Augustine", work: "Reply to Faustus the Manichaean", where: "Book 26, sec. 3", url: "https://www.newadvent.org/fathers/140626.htm", about: "Miracles are not against nature, only against nature as known to us", summary: "Augustine argues that God, who established all natural order, does nothing contrary to nature; what seems 'contrary to nature' is contrary to our experience of it.", quote: "But God, the Author and Creator of all natures, does nothing contrary to nature; for whatever is done by Him who appoints all natural order and measure and proportion must be natural in every case.", anchor: "the Author and Creator of all natures", anchorEnd: "be natural in every case" },
        { who: "Origen", work: "Against Celsus", where: "Book 2, ch. 48", url: "https://www.ccel.org/ccel/schaff/anf04.vi.ix.ii.xlviii.html", about: "Answers Celsus's charge that Jesus' miracles were sorcery", summary: "Origen replies that Christians recognize Jesus' healings of the lame and blind as signs of his messiahship because the prophets foretold them.", quote: "That He healed the lame and the blind, and that therefore we hold Him to be the Christ and the Son of God, is manifest to us from what is contained in the prophecies", anchor: "That He healed the lame and the blind", anchorEnd: "contained in the prophecies" }
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
        { who: "John Chrysostom", work: "Homilies on the Statues", where: "Homily 12, secs. 9–14", url: "https://www.newadvent.org/fathers/190112.htm", about: "Natural law and conscience implanted in all; Romans 2:14–15", summary: "Chrysostom argues that a Gentile without the written law can still be judged, because he has a conscience inwardly admonishing and teaching him.", quote: "If, then, he had not heard the law, nor conversed with the Jews, how could there be wrath, indignation and tribulation against him for working evil? The reason is, that he possessed a conscience inwardly admonishing him, and teaching him, and instructing him in all things.", anchor: "he had not heard the law", anchorEnd: "instructing him in all things" },
        { who: "Justin Martyr", work: "Second Apology", where: "ch. 13", url: "https://www.newadvent.org/fathers/0127.htm", about: "The seed of the Word in all people; truth found among pagans belongs to Christians", summary: "Justin claims whatever has been rightly said by anyone belongs to Christians, who worship the Word who became man to share our sufferings and heal us.", quote: "Whatever things were rightly said among all men, are the property of us Christians. For next to God, we worship and love the Word who is from the unbegotten and ineffable God, since also He became man for our sakes, that becoming a partaker of our sufferings, He might also bring us healing.", anchor: "Whatever things were rightly said among all men", anchorEnd: "might also bring us healing" }
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
        { who: "John Chrysostom", work: "Homilies on Romans", where: "Homily 10 (Rom 5:12–6:2)", url: "https://www.newadvent.org/fathers/210210.htm", about: "What \"made sinners\" through Adam means: liable to punishment and death", summary: "Chrysostom takes \"made sinners\" through Adam to mean made liable to punishment and condemned to death.", quote: "What then does the word \"sinners\" mean here? To me it seems to mean liable to punishment and condemned to death.", anchor: "What then does the word", anchorEnd: "and condemned to death" },
        { who: "Cyprian of Carthage", work: "Letter 58 (to Fidus)", where: "sec. 5", url: "https://www.newadvent.org/fathers/050658.htm", about: "Infants contract the contagion of the ancient death from Adam at birth", summary: "Cyprian says a newborn has committed no sin of its own but, born of Adam, has contracted the contagion of the ancient death, so baptism remits another's sins.", quote: "how much rather ought we to shrink from hindering an infant, who, being lately born, has not sinned, except in that, being born after the flesh according to Adam, he has contracted the contagion of the ancient death at its earliest birth, who approaches the more easily on this very account to the reception of the forgiveness of sins— that to him are remitted, not his own sins, but the sins of another.", anchor: "how much rather ought we to shrink", anchorEnd: "but the sins of another" }
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
        { who: "John Chrysostom", work: "Homilies on Romans", where: "Homily 13 (Rom 7:14–8:11)", url: "https://www.newadvent.org/fathers/210213.htm", about: "Reads Romans 7 as the person under the law before grace", summary: "Chrysostom reads 'I am carnal' as Paul sketching humanity under the Law and before the Law, not the Christian under grace.", quote: "Wherefore he went on to say, 'but I am carnal;' giving us a sketch now of man, as comporting himself in the Law, and before the Law.", anchor: "Wherefore he went on to say", anchorEnd: "and before the Law" },
        { who: "Augustine", work: "On Man's Perfection in Righteousness", where: "", url: "https://www.newadvent.org/fathers/1504.htm", about: "Answers Caelestius on whether a person can live without sin in this life", summary: "Augustine argues that no one can be without sin, even by wishing it, unless assisted by God's grace through Jesus Christ.", quote: "No man, therefore, can be without sin, even if he wish it, unless he be assisted by the grace of God through our Lord Jesus Christ.", anchor: "unless he be assisted by the grace", anchorEnd: "our Lord Jesus Christ" }
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
        { who: "Augustine", work: "Letter 130 (to Proba)", where: "ch. 8", url: "https://www.newadvent.org/fathers/1102130.htm", about: "Why ask if God already knows our needs; prayer enlarging our desire", summary: "Augustine says God, who already knows our needs, bids us pray not to inform him but to stretch our desire so we can receive what he prepares to give.", quote: "Why this should be done by Him who \"before we ask Him knows what things we have need of,\" might perplex our minds, if we did not understand that the Lord our God requires us to ask not that thereby our wish may be intimated to Him, for to Him it cannot be unknown, but in order that by prayer there may be exercised in us by supplications that desire by which we may receive what He prepares to bestow.", anchor: "Why this should be done by Him who", anchorEnd: "what He prepares to bestow" },
        { who: "Origen", work: "On Prayer", where: "secs. 3–4 (Curtis translation)", url: "https://www.tertullian.org/fathers/origen_on_prayer_02_text.htm", about: "Objection that prayer is superfluous given foreknowledge; his reply", summary: "Origen reasons that since God foreknows our free choices and arranges providence accordingly, he has also foreseen each person's prayers and desires.", quote: "If, therefore, our individual free wills have been known by Him, and if in His providence He has on that account been careful to make due arrangement for each one, it is reasonable to believe that He has also pre-comprehended what a particular man is to pray in that faith, what his disposition, and what his desire.", anchor: "our individual free wills have been known by Him", anchorEnd: "and what his desire" },
        { who: "Gregory the Great", work: "Dialogues", where: "Book 1, ch. 8", url: "https://www.tertullian.org/fathers/gregory_01_dialogues_book1.htm", about: "Whether prayer can obtain what is predestined", summary: "Gregory teaches that what God has not predestined cannot be obtained, but what holy men obtain by prayer was predestined from eternity to be obtained through prayer.", quote: "Such things as be not predestinate by God, cannot by any means be obtained at his hands; but those things which holy men do by their prayers effect, were from all eternity predestinate to be obtained by prayers.", anchor: "Such things as be not predestinate", anchorEnd: "to be obtained by prayers" }
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
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 2, ch. 13, sec. 3", url: "https://www.newadvent.org/fathers/0103213.htm", about: "God as simple and uncompounded, wholly mind, without parts", summary: "Irenaeus describes God as simple and uncompounded, without parts, wholly understanding, spirit, thought, light, and the source of all good.", quote: "He is a simple, uncompounded Being, without diverse members, and altogether like, and equal to himself, since He is wholly understanding, and wholly spirit, and wholly thought, and wholly intelligence, and wholly reason, and wholly hearing, and wholly seeing, and wholly light, and the whole source of all that is good— even as the religious and pious are wont to speak concerning God.", anchor: "He is a simple", anchorEnd: "wont to speak concerning God" },
        { who: "Augustine", work: "City of God", where: "Book 11, ch. 10", url: "https://www.newadvent.org/fathers/120111.htm", about: "The simple Trinity, in whom substance and quality are identical", summary: "Augustine says the Trinity is called simple because it has nothing it can lose and is not one thing containing another, as a cup holds its liquid.", quote: "It is for this reason, then, that the nature of the Trinity is called simple, because it has not anything which it can lose, and because it is not one thing and its contents another, as a cup and the liquor, or a body and its color, or the air and the light or heat of it, or a mind and its wisdom.", anchor: "that the nature of the Trinity is called simple", anchorEnd: "a mind and its wisdom" },
        { who: "John of Damascus", work: "An Exact Exposition of the Orthodox Faith", where: "Book 1, ch. 9", url: "https://www.newadvent.org/fathers/33041.htm", about: "What our affirmations about God signify, given that he is simple", summary: "John of Damascus holds that, since God is simple, our affirmations about him signify not his essence but something inexpressible, a relation, something following his nature, or an energy.", quote: "Each then of the affirmations about God should be thought of as signifying not what He is in essence, but either something that it is impossible to make plain, or some relation to some of those things which are contrasts or some of those things that follow the nature, or an energy.", anchor: "Each then of the affirmations about God", anchorEnd: "or an energy" }
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
        { who: "Tertullian", work: "The Chaplet (De Corona)", where: "ch. 11", url: "https://www.newadvent.org/fathers/0304.htm", about: "Whether military service is lawful for Christians at all", summary: "Tertullian asks how a son of peace, who should not even go to law, could make the sword his occupation when Christ warns its users will perish by it.", quote: "Shall it be held lawful to make an occupation of the sword, when the Lord proclaims that he who uses the sword shall perish by the sword? And shall the son of peace take part in the battle when it does not become him even to sue at law?", anchor: "Shall it be held lawful to make", anchorEnd: "even to sue at law" },
        { who: "Origen", work: "Against Celsus", where: "Book 8, ch. 73", url: "https://www.ccel.org/ccel/schaff/anf04.vi.ix.viii.lxxiii.html", about: "Answers the demand that Christians fight: they aid rulers by prayer", summary: "Origen says Christians fight best for the emperor not by serving under him as soldiers but as an army of piety offering prayers to God.", quote: "And none fight better for the king than we do. We do not indeed fight under him, although he require it; but we fight on his behalf, forming a special army—an army of piety—by offering our prayers to God.", anchor: "And none fight better for the king", anchorEnd: "offering our prayers to God" },
        { who: "Augustine", work: "Letter 189 (to Boniface)", where: "secs. 4–6", url: "https://www.newadvent.org/fathers/1102189.htm", about: "Counsels a Christian soldier; war waged for the sake of peace", summary: "Augustine counsels a soldier that peace must be the goal, and war waged only from necessity so that peace may be obtained.", quote: "Peace should be the object of your desire; war should be waged only as a necessity, and waged only that God may by it deliver men from the necessity and preserve them in peace. For peace is not sought in order to the kindling of war, but war is waged in order that peace may be obtained.", anchor: "Peace should be the object of your desire", anchorEnd: "peace may be obtained" }
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
        { who: "Justin Martyr", work: "First Apology", where: "ch. 46", url: "https://www.ccel.org/ccel/schaff/anf01.viii.ii.xlvi.html", about: "Those before Christ who lived by the Word (Logos)", summary: "Justin says Christ is the Word in whom all humanity shares, so those who lived by reason, like Socrates and Heraclitus, were Christians even if thought atheists.", quote: "We have been taught that Christ is the first-born of God, and we have declared above that He is the Word of whom every race of men were partakers; and those who lived reasonably are Christians, even though they have been thought atheists; as, among the Greeks, Socrates and Heraclitus, and men like them;", anchor: "We have been taught that Christ", anchorEnd: "and men like them" },
        { who: "Augustine", work: "Letter 102 (to Deogratias)", where: "Question 2, secs. 8–15", url: "https://www.newadvent.org/fathers/1102102.htm", about: "Porphyry's objection: what of people who lived before Christ came?", summary: "Augustine argues that from the beginning, whoever believed in Christ, knew him in any way, and lived piously by his precepts was saved through him, whenever and wherever they lived.", quote: "Therefore, from the beginning of the human race, whosoever believed in Him, and in any way knew Him, and lived in a pious and just manner according to His precepts, was undoubtedly saved by Him, in whatever time and place he may have lived.", anchor: "whosoever believed in Him", anchorEnd: "and place he may have lived" },
        { who: "Clement of Alexandria", work: "Stromata", where: "Book 6, ch. 6", url: "https://www.newadvent.org/fathers/02106.htm", about: "The gospel preached to Jews and Gentiles in Hades", summary: "Clement holds that the gospel was preached in Hades, so that the righteous who repented there could be saved, each according to his own knowledge.", quote: "For it was suitable to the divine administration, that those possessed of greater worth in righteousness, and whose life had been pre-eminent, on repenting of their transgressions, though found in another place, yet being confessedly of the number of the people of God Almighty, should be saved, each one according to his individual knowledge.", anchor: "For it was suitable to the divine administration", anchorEnd: "according to his individual knowledge" }
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
        { who: "Augustine", work: "City of God", where: "Book 11, chs. 6–7", url: "https://www.newadvent.org/fathers/120111.htm", about: "What kind of days had morning and evening before the sun existed", summary: "Augustine admits it is extremely hard, perhaps impossible, to conceive what the creation days were, since the first three passed without the sun, made on the fourth day.", quote: "What kind of days these were it is extremely difficult, or perhaps impossible for us to conceive, and how much more to say! We see, indeed, that our ordinary days have no evening but by the setting, and no morning but by the rising, of the sun; but the first three days of all were passed without sun, since it is reported to have been made on the fourth day.", anchor: "What kind of days these were", anchorEnd: "made on the fourth day" },
        { who: "Origen", work: "On First Principles (De Principiis)", where: "Book 4, sec. 16", url: "https://www.newadvent.org/fathers/04124.htm", about: "Cites days without sun, moon, and stars as signs of a non-literal sense", summary: "Origen asks who with understanding could think the first three days, with their evenings and mornings, literally existed without sun, moon, stars, or even a sky.", quote: "Now who is there, pray, possessed of understanding, that will regard the statement as appropriate, that the first day, and the second, and the third, in which also both evening and morning are mentioned, existed without sun, and moon, and stars — the first day even without a sky?", anchor: "that will regard the statement as appropriate", anchorEnd: "even without a sky" },
        { who: "Theophilus of Antioch", work: "To Autolycus", where: "Book 2, chs. 11–12", url: "https://www.newadvent.org/fathers/02042.htm", about: "Recounts the six days' work and marvels at its greatness", summary: "Theophilus says no one could worthily explain the six days' work, even with ten thousand tongues, so great is the wisdom of God in it.", quote: "Of this six days' work no man can give a worthy explanation and description of all its parts, not though he had ten thousand tongues and ten thousand mouths", anchor: "work no man can give a worthy explanation", anchorEnd: "ten thousand mouths" }
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
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 5, ch. 31", url: "https://www.newadvent.org/fathers/0103531.htm", about: "Souls await the resurrection in an invisible place, not straight to heaven", summary: "Irenaeus teaches that the souls of Christ's disciples go to an invisible place allotted by God to await the resurrection, then rise bodily into God's presence.", quote: "it is manifest that the souls of His disciples also, upon whose account the Lord underwent these things, shall go away into the invisible place allotted to them by God, and there remain until the resurrection, awaiting that event; then receiving their bodies, and rising in their entirety, that is bodily, just as the Lord arose, they shall come thus into the presence of God.", anchor: "it is manifest that the souls of His", anchorEnd: "into the presence of God" },
        { who: "Athenagoras", work: "On the Resurrection of the Dead", where: "ch. 15", url: "https://www.newadvent.org/fathers/0206.htm", about: "Human nature as soul and body together, requiring resurrection", summary: "Athenagoras argues that it is the whole man, not the soul alone, who received reason, so man as soul and body must continue forever, which requires resurrection.", quote: "But that which has received both understanding and reason is man, not the soul by itself. Man, therefore, who consists of the two parts, must continue forever. But it is impossible for him to continue unless he rise again.", anchor: "But that which has received both understanding", anchorEnd: "unless he rise again" },
        { who: "Augustine", work: "Enchiridion", where: "ch. 109", url: "https://www.ccel.org/ccel/schaff/npnf103.iv.ii.cxi.html", about: "The state of the soul between death and the resurrection", summary: "Augustine says that between death and the final resurrection the soul dwells in a hidden retreat, at rest or in affliction according to the life it led.", quote: "During the time, moreover, which intervenes between a man's death and the final resurrection, the soul dwells in a hidden retreat, where it enjoys rest or suffers affliction just in proportion to the merit it has earned by the life which it led on earth.", anchor: "the soul dwells in a hidden retreat", anchorEnd: "life which it led on earth" }
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
        { who: "Ignatius of Antioch", work: "Letter to the Smyrnaeans", where: "ch. 8", url: "https://www.newadvent.org/fathers/0109.htm", about: "Unity around the bishop as the mark of the true Church and Eucharist", summary: "Ignatius urges the people to gather wherever the bishop is, just as wherever Jesus Christ is, there is the Catholic Church.", quote: "Wherever the bishop shall appear, there let the multitude [of the people] also be; even as, wherever Jesus Christ is, there is the Catholic Church.", anchor: "Wherever the bishop shall appear", anchorEnd: "there is the Catholic Church" },
        { who: "Irenaeus of Lyons", work: "Against Heresies", where: "Book 1, ch. 10, sec. 2", url: "https://www.newadvent.org/fathers/0103110.htm", about: "The scattered Church keeping one faith as if in one house", summary: "Irenaeus says the Church, though scattered throughout the world, carefully keeps the one faith it received as if living in one house.", quote: "the Church, having received this preaching and this faith, although scattered throughout the whole world, yet, as if occupying but one house, carefully preserves it.", anchor: "having received this preaching and this faith", anchorEnd: "carefully preserves it" },
        { who: "Cyril of Jerusalem", work: "Catechetical Lecture 18", where: "secs. 23–26", url: "https://www.newadvent.org/fathers/310118.htm", about: "Why the Church is called catholic, and how to tell it from rival assemblies", summary: "Cyril advises travelers to ask not merely for the Lord's house or the church, since sects use those names, but for the Catholic Church.", quote: "And if ever you are sojourning in cities, inquire not simply where the Lord's House is (for the other sects of the profane also attempt to call their own dens houses of the Lord), nor merely where the Church is, but where is the Catholic Church.", anchor: "And if ever you are sojourning in cities", anchorEnd: "where is the Catholic Church" }
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
        { who: "Theophilus of Antioch", work: "To Autolycus", where: "Book 1, chs. 2–5", url: "https://www.newadvent.org/fathers/02041.htm", about: "\"Show me your God\": why God is unseen, and seen by the purified soul", summary: "Theophilus says the soul must be pure like a polished mirror, because sin, like rust, keeps a person from seeing God.", quote: "As a burnished mirror, so ought man to have his soul pure. When there is rust on the mirror, it is not possible that a man's face be seen in the mirror; so also when there is sin in a man, such a man cannot behold God.", anchor: "As a burnished mirror", anchorEnd: "such a man cannot behold God" },
        { who: "Minucius Felix", work: "Octavius", where: "ch. 18", url: "https://www.newadvent.org/fathers/0410.htm", about: "God beyond sight and comprehension, yet evident through creation's order", summary: "Minucius Felix says God cannot be seen, grasped, or measured, being brighter than light and greater than all perception, his greatness known only to himself.", quote: "He can neither be seen — He is brighter than light; nor can be grasped — He is purer than touch; nor estimated; He is greater than all perceptions; infinite, immense, and how great is known to Himself alone.", anchor: "He can neither be seen", anchorEnd: "known to Himself alone" }
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
