// Seek Like Silver — question bank
//
// Each question has:
//   id       – permanent ID (never reuse or change one; saved answers point to it)
//   prompt   – the question
//   verses   – Scripture references to read (references only, so no translation copyright issues)
//   readings – theologians, each pointed to a SPECIFIC work, never a paraphrased quote
//
// Levels:
//   beginner    – What does this passage say?
//   moderate    – How does this fit with the rest of Scripture?
//   philosopher – Where do Christians wrestle or disagree, and what's at stake?
//
// Add new questions at the end of a level's list with the next ID (b11, m11, p11, ...).

const QUESTIONS = {
  beginner: [
    {
      id: "b1",
      prompt: "John's Gospel opens by calling Jesus \"the Word.\" Who is the Word, according to John 1:1–14, and what does it mean that the Word \"became flesh\"?",
      verses: ["John 1:1-14", "Philippians 2:5-8", "Colossians 1:15-20"],
      readings: [
        { who: "Athanasius", work: "On the Incarnation" },
        { who: "C.S. Lewis", work: "Mere Christianity, Book 4" }
      ]
    },
    {
      id: "b2",
      prompt: "What does Genesis 1:26–28 teach about what it means for human beings to be made in the image of God?",
      verses: ["Genesis 1:26-28", "Genesis 9:6", "James 3:9", "Colossians 3:10"],
      readings: [
        { who: "Irenaeus of Lyons", work: "Against Heresies, Book 5" },
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 1, ch. 15" }
      ]
    },
    {
      id: "b3",
      prompt: "In the parable of the prodigal son, what does the father's response to his returning son teach about God?",
      verses: ["Luke 15:11-32", "Psalm 103:8-13", "Romans 5:8"],
      readings: [
        { who: "Henri Nouwen", work: "The Return of the Prodigal Son" },
        { who: "Timothy Keller", work: "The Prodigal God" }
      ]
    },
    {
      id: "b4",
      prompt: "In the parable of the Good Samaritan, Jesus answers the question \"Who is my neighbor?\" What is his answer, and what does it ask of us?",
      verses: ["Luke 10:25-37", "Leviticus 19:18", "1 John 4:19-21"],
      readings: [
        { who: "Augustine", work: "On Christian Doctrine, Book 1" },
        { who: "Dietrich Bonhoeffer", work: "Life Together" }
      ]
    },
    {
      id: "b5",
      prompt: "According to Ephesians 2:8–10, how is a person saved, and where do good works fit in?",
      verses: ["Ephesians 2:8-10", "Titus 3:4-7", "James 2:14-26"],
      readings: [
        { who: "Martin Luther", work: "The Freedom of a Christian" },
        { who: "Augustine", work: "On the Spirit and the Letter" }
      ]
    },
    {
      id: "b6",
      prompt: "What does the Lord's Prayer teach us about what prayer is and what we should pray for?",
      verses: ["Matthew 6:5-13", "Philippians 4:6-7", "Romans 8:26"],
      readings: [
        { who: "Cyprian of Carthage", work: "On the Lord's Prayer" },
        { who: "Martin Luther", work: "A Simple Way to Pray" }
      ]
    },
    {
      id: "b7",
      prompt: "Psalm 23 describes God as a shepherd. What does this image teach about how God cares for his people?",
      verses: ["Psalm 23", "John 10:11-15", "Ezekiel 34:11-16"],
      readings: [
        { who: "Charles Spurgeon", work: "The Treasury of David, on Psalm 23" },
        { who: "Augustine", work: "Expositions on the Psalms" }
      ]
    },
    {
      id: "b8",
      prompt: "Why did Jesus die? What reasons do 1 Corinthians 15:3–4 and Isaiah 53 give?",
      verses: ["1 Corinthians 15:3-8", "Isaiah 53:4-6", "Mark 10:45"],
      readings: [
        { who: "Athanasius", work: "On the Incarnation" },
        { who: "John Stott", work: "The Cross of Christ" }
      ]
    },
    {
      id: "b9",
      prompt: "What does Jesus say the Holy Spirit will do for his followers?",
      verses: ["John 14:15-27", "John 16:7-15", "Galatians 5:22-23"],
      readings: [
        { who: "Basil of Caesarea", work: "On the Holy Spirit" },
        { who: "J.I. Packer", work: "Keep in Step with the Spirit" }
      ]
    },
    {
      id: "b10",
      prompt: "According to 1 Corinthians 15, what would be lost if Jesus had not risen from the dead? What does his resurrection change?",
      verses: ["1 Corinthians 15:12-22", "Romans 6:4-5", "1 Peter 1:3"],
      readings: [
        { who: "N.T. Wright", work: "Surprised by Hope" },
        { who: "Athanasius", work: "On the Incarnation" }
      ]
    }
  ],

  moderate: [
    {
      id: "m1",
      prompt: "How does the Passover in Exodus 12 help explain the Last Supper and the meaning of Jesus' death?",
      verses: ["Exodus 12:1-14", "Luke 22:7-20", "1 Corinthians 5:7", "John 1:29"],
      readings: [
        { who: "Melito of Sardis", work: "On Pascha" },
        { who: "Brant Pitre", work: "Jesus and the Jewish Roots of the Eucharist" }
      ]
    },
    {
      id: "m2",
      prompt: "Paul says we are justified by faith apart from works of the law (Romans 3:28). James says a person is justified by works and not by faith alone (James 2:24). How do these fit together?",
      verses: ["Romans 3:21-28", "James 2:14-26", "Galatians 5:6", "Genesis 15:6"],
      readings: [
        { who: "Martin Luther", work: "Preface to the Epistle to the Romans" },
        { who: "Council of Trent", work: "Session 6, Decree on Justification" },
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 3, ch. 17" }
      ]
    },
    {
      id: "m3",
      prompt: "How does God's covenant with Abraham in Genesis shape Paul's argument in Galatians 3 about who belongs to God's family?",
      verses: ["Genesis 12:1-3", "Genesis 15:6", "Galatians 3:6-29", "Romans 4"],
      readings: [
        { who: "O. Palmer Robertson", work: "The Christ of the Covenants" },
        { who: "Scott Hahn", work: "Kinship by Covenant" }
      ]
    },
    {
      id: "m4",
      prompt: "Trace the theme of God dwelling with his people from Eden to the tabernacle, the temple, Jesus, the church, and the new creation. What does this story reveal?",
      verses: ["Genesis 3:8", "Exodus 40:34-38", "1 Kings 8:10-11", "John 1:14", "1 Corinthians 3:16", "Revelation 21:3"],
      readings: [
        { who: "G.K. Beale", work: "The Temple and the Church's Mission" },
        { who: "Yves Congar", work: "The Mystery of the Temple" }
      ]
    },
    {
      id: "m5",
      prompt: "Jesus' favorite title for himself was \"Son of Man.\" How does Daniel 7:13–14 shape what that title means, and why did Jesus' use of it at his trial provoke such a reaction?",
      verses: ["Daniel 7:13-14", "Mark 14:61-64", "Matthew 26:64"],
      readings: [
        { who: "N.T. Wright", work: "Jesus and the Victory of God" },
        { who: "Richard Bauckham", work: "Jesus and the God of Israel" }
      ]
    },
    {
      id: "m6",
      prompt: "Job's friends assume his suffering must be punishment for sin. How do the book of Job and Jesus' words in John 9 challenge that assumption?",
      verses: ["Job 1-2", "Job 38-42", "John 9:1-3", "Luke 13:1-5"],
      readings: [
        { who: "Gregory the Great", work: "Moralia in Job" },
        { who: "D.A. Carson", work: "How Long, O Lord?" }
      ]
    },
    {
      id: "m7",
      prompt: "How does the Day of Atonement in Leviticus 16 help explain what Hebrews says about Jesus as our high priest?",
      verses: ["Leviticus 16", "Hebrews 4:14-16", "Hebrews 9:11-14", "Hebrews 10:1-14"],
      readings: [
        { who: "John Chrysostom", work: "Homilies on Hebrews" },
        { who: "John Owen", work: "An Exposition of the Epistle to the Hebrews" }
      ]
    },
    {
      id: "m8",
      prompt: "Paul compares Adam and Christ in Romans 5 and 1 Corinthians 15. What does each one bring to humanity, and why does Paul set them side by side?",
      verses: ["Romans 5:12-21", "1 Corinthians 15:21-22", "1 Corinthians 15:45-49", "Genesis 3"],
      readings: [
        { who: "Irenaeus of Lyons", work: "Against Heresies, Book 3" },
        { who: "Augustine", work: "City of God, Book 13" }
      ]
    },
    {
      id: "m9",
      prompt: "How does Pentecost in Acts 2 relate to the Tower of Babel in Genesis 11 and the prophecy of Joel 2?",
      verses: ["Genesis 11:1-9", "Joel 2:28-32", "Acts 2:1-21"],
      readings: [
        { who: "Cyril of Jerusalem", work: "Catechetical Lectures 16–17" },
        { who: "Sinclair Ferguson", work: "The Holy Spirit" }
      ]
    },
    {
      id: "m10",
      prompt: "Jesus said he came not to abolish the Law but to fulfill it. In the Sermon on the Mount, how does he relate to the Law of Moses?",
      verses: ["Matthew 5:17-48", "Jeremiah 31:31-34", "Romans 10:4"],
      readings: [
        { who: "Augustine", work: "Our Lord's Sermon on the Mount" },
        { who: "Dietrich Bonhoeffer", work: "Discipleship (The Cost of Discipleship)" }
      ]
    }
  ],

  philosopher: [
    {
      id: "p1",
      prompt: "If God knows everything that will happen, are human choices truly free? How have Christians tried to hold divine foreknowledge and human freedom together?",
      verses: ["Romans 8:28-30", "Romans 9:14-24", "Acts 2:23", "Philippians 2:12-13", "Deuteronomy 30:19"],
      readings: [
        { who: "Augustine", work: "On Free Choice of the Will" },
        { who: "Boethius", work: "The Consolation of Philosophy, Book 5" },
        { who: "Luis de Molina", work: "On Divine Foreknowledge (Part IV of the Concordia)" },
        { who: "Jonathan Edwards", work: "Freedom of the Will" }
      ]
    },
    {
      id: "p2",
      prompt: "If God is all-good and all-powerful, why is there evil? Is evil a \"thing\" God created, or something else?",
      verses: ["Genesis 50:20", "Romans 8:18-23", "Job 38:1-11", "Revelation 21:4"],
      readings: [
        { who: "Augustine", work: "Enchiridion, chs. 10–14" },
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part I, Questions 48–49" },
        { who: "Alvin Plantinga", work: "God, Freedom, and Evil" }
      ]
    },
    {
      id: "p3",
      prompt: "How can God be one and yet three persons without contradiction? What would be lost if we said God is only one person, or three separate gods?",
      verses: ["Deuteronomy 6:4", "Matthew 28:19", "John 1:1", "2 Corinthians 13:14"],
      readings: [
        { who: "Gregory of Nazianzus", work: "Theological Orations (Orations 27–31)" },
        { who: "Augustine", work: "On the Trinity" },
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part I, Questions 27–43" }
      ]
    },
    {
      id: "p4",
      prompt: "Scripture says God does not change (Malachi 3:6), yet also describes God grieving and relenting (Genesis 6:6; Hosea 11:8). Does God change, or suffer? What is at stake either way?",
      verses: ["Malachi 3:6", "James 1:17", "Genesis 6:6", "Hosea 11:8-9"],
      readings: [
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part I, Question 9" },
        { who: "Thomas Weinandy", work: "Does God Suffer?" },
        { who: "Jürgen Moltmann", work: "The Crucified God" }
      ]
    },
    {
      id: "p5",
      prompt: "The Council of Chalcedon (451) said Christ is one person in two natures, fully God and fully man. Why did the early church insist on both, and what goes wrong if you lose either one?",
      verses: ["John 1:14", "Philippians 2:5-11", "Hebrews 4:15", "Colossians 2:9"],
      readings: [
        { who: "Leo the Great", work: "The Tome of Leo" },
        { who: "Cyril of Alexandria", work: "On the Unity of Christ" },
        { who: "Council of Chalcedon", work: "The Chalcedonian Definition (451)" }
      ]
    },
    {
      id: "p6",
      prompt: "When Jesus said \"This is my body,\" what did he mean? How do Catholic, Orthodox, Lutheran, and Reformed Christians understand Christ's presence in the Lord's Supper, and why does it matter?",
      verses: ["Matthew 26:26-28", "John 6:51-58", "1 Corinthians 10:16-17", "1 Corinthians 11:23-29"],
      readings: [
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part III, Questions 73–83" },
        { who: "John of Damascus", work: "An Exact Exposition of the Orthodox Faith, Book 4, ch. 13" },
        { who: "Martin Luther", work: "The Babylonian Captivity of the Church" },
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 4, ch. 17" }
      ]
    },
    {
      id: "p7",
      prompt: "God is infinite and our words are finite. When we call God \"good\" or \"wise,\" do those words mean the same thing they mean for us, something completely different, or something in between?",
      verses: ["Isaiah 55:8-9", "Romans 11:33-36", "Exodus 3:14", "1 Timothy 6:16"],
      readings: [
        { who: "Pseudo-Dionysius", work: "The Divine Names and The Mystical Theology" },
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part I, Question 13" }
      ]
    },
    {
      id: "p8",
      prompt: "Does faith go beyond reason, against reason, or depend on reason? Can we reason our way to God, or only understand after we believe?",
      verses: ["1 Peter 3:15", "Acts 17:22-31", "1 Corinthians 1:18-25", "Hebrews 11:1-3"],
      readings: [
        { who: "Anselm of Canterbury", work: "Proslogion" },
        { who: "Thomas Aquinas", work: "Summa Contra Gentiles, Book 1, chs. 3–8" },
        { who: "Blaise Pascal", work: "Pensées" },
        { who: "Søren Kierkegaard", work: "Fear and Trembling" }
      ]
    },
    {
      id: "p9",
      prompt: "Why did God become man, and how exactly does Christ's death save us? Compare the idea of Christ paying a debt of honor, Christ as a substitute bearing punishment, and Christ as victor over sin, death, and the devil.",
      verses: ["Mark 10:45", "Romans 3:23-26", "Colossians 2:13-15", "Hebrews 2:14-15"],
      readings: [
        { who: "Anselm of Canterbury", work: "Why God Became Man (Cur Deus Homo)" },
        { who: "Gustaf Aulén", work: "Christus Victor" },
        { who: "Athanasius", work: "On the Incarnation" }
      ]
    },
    {
      id: "p10",
      prompt: "Is God outside of time altogether, or does God exist through all time without beginning or end? How would each view change the way we understand prayer and God's knowledge?",
      verses: ["Psalm 90:2", "2 Peter 3:8", "Revelation 1:8", "Isaiah 57:15"],
      readings: [
        { who: "Augustine", work: "Confessions, Book 11" },
        { who: "Boethius", work: "The Consolation of Philosophy, Book 5" }
      ]
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
