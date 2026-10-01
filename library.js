// Seek Like Silver — Library
//
// Every book the site points to, with where to read it.
//   free: true  -> public domain or officially free to read; `url` goes there.
//                  Every free link was opened and checked on 2026-09-30.
//   free: false -> still in copyright. We never host or link pirated copies;
//                  "Find a copy" searches libraries (WorldCat).
//
// When you add a question that cites a new book, add the book here too.
// `cites` lists other wordings used in questions.js, so those link here as well.

const LIBRARY = [
  // ───── Free to read ─────
  { who: "Anselm of Canterbury", work: "Proslogion and Why God Became Man (Cur Deus Homo)", free: true, source: "CCEL", url: "https://ccel.org/ccel/anselm/basic_works" },
  { who: "Athanasius", work: "On the Incarnation", free: true, source: "New Advent", url: "https://www.newadvent.org/fathers/2802.htm" },
  { who: "Augustine", work: "City of God", free: true, source: "New Advent", url: "https://www.newadvent.org/fathers/1201.htm" },
  { who: "Augustine", work: "Confessions", free: true, source: "New Advent", url: "https://www.newadvent.org/fathers/1101.htm" },
  { who: "Augustine", work: "Enchiridion", free: true, source: "New Advent", url: "https://www.newadvent.org/fathers/1302.htm" },
  { who: "Augustine", work: "Expositions on the Psalms", free: true, source: "New Advent", url: "https://www.newadvent.org/fathers/1801.htm" },
  { who: "Augustine", work: "On Christian Doctrine", free: true, source: "New Advent", url: "https://www.newadvent.org/fathers/1202.htm" },
  { who: "Augustine", work: "On the Spirit and the Letter", free: true, source: "New Advent", url: "https://www.newadvent.org/fathers/1502.htm" },
  { who: "Augustine", work: "On the Trinity", free: true, source: "New Advent", url: "https://www.newadvent.org/fathers/1301.htm" },
  { who: "Augustine", work: "Our Lord's Sermon on the Mount", free: true, source: "New Advent", url: "https://www.newadvent.org/fathers/1601.htm" },
  { who: "Basil of Caesarea", work: "On the Holy Spirit", free: true, source: "New Advent", url: "https://www.newadvent.org/fathers/3203.htm" },
  { who: "Blaise Pascal", work: "Pensées", free: true, source: "Project Gutenberg", url: "https://www.gutenberg.org/ebooks/18269" },
  { who: "Boethius", work: "The Consolation of Philosophy", free: true, source: "Project Gutenberg", url: "https://www.gutenberg.org/ebooks/14328" },
  { who: "Charles Spurgeon", work: "The Treasury of David, Volume I (Psalms 1–26)", cites: ["The Treasury of David, on Psalm 23"], free: true, source: "CCEL", url: "https://www.ccel.org/ccel/spurgeon/treasury1.html" },
  { who: "Charles Spurgeon", work: "Sermons", cites: ["Charles Spurgeon's sermons"], free: true, source: "The Spurgeon Library", url: "https://www.spurgeon.org/resource-library/sermons/" },
  { who: "Council of Chalcedon", work: "The Chalcedonian Definition (451)", free: true, source: "New Advent", url: "https://www.newadvent.org/fathers/3811.htm" },
  { who: "Council of Constantinople", work: "The Nicene Creed (381)", cites: ["The Nicene Creed (381)"], free: true, source: "New Advent", url: "https://www.newadvent.org/fathers/3808.htm" },
  { who: "Council of Trent", work: "Decree on Justification (Session 6)", cites: ["Session 6, Decree on Justification"], free: true, source: "Papal Encyclicals Online", url: "https://www.papalencyclicals.net/councils/trent/sixth-session.htm" },
  { who: "Cyprian of Carthage", work: "On the Lord's Prayer", free: true, source: "New Advent", url: "https://www.newadvent.org/fathers/050704.htm" },
  { who: "Cyril of Jerusalem", work: "Catechetical Lectures", free: true, source: "New Advent", url: "https://www.newadvent.org/fathers/3101.htm" },
  { who: "Gregory of Nazianzus", work: "Theological Orations (Orations 27–31)", free: true, source: "New Advent", url: "https://www.newadvent.org/fathers/3102.htm" },
  { who: "Gregory the Great", work: "Moralia in Job", free: true, source: "Lectionary Central", url: "https://www.lectionarycentral.com/GregoryMoralia/Book01.html" },
  { who: "Irenaeus of Lyons", work: "Against Heresies", free: true, source: "New Advent", url: "https://www.newadvent.org/fathers/0103.htm" },
  { who: "John Calvin", work: "Institutes of the Christian Religion", free: true, source: "CCEL", url: "https://ccel.org/ccel/calvin/institutes" },
  { who: "John Chrysostom", work: "Homilies on Hebrews", free: true, source: "New Advent", url: "https://www.newadvent.org/fathers/2402.htm" },
  { who: "John of Damascus", work: "An Exact Exposition of the Orthodox Faith", free: true, source: "New Advent", url: "https://www.newadvent.org/fathers/3304.htm" },
  { who: "John Owen", work: "An Exposition of the Epistle to the Hebrews", free: true, source: "Internet Archive (scanned volumes)", url: "https://archive.org/details/expositionofepis184003owen" },
  { who: "John Wesley", work: "Sermons on Several Occasions", free: true, source: "CCEL", url: "https://ccel.org/ccel/wesley/sermons" },
  { who: "Jonathan Edwards", work: "Freedom of the Will", free: true, source: "CCEL", url: "https://ccel.org/ccel/edwards/will" },
  { who: "Leo the Great", work: "The Tome of Leo (Letter 28)", free: true, source: "New Advent", url: "https://www.newadvent.org/fathers/3604028.htm" },
  { who: "Martin Luther", work: "The Freedom of a Christian and The Babylonian Captivity of the Church", free: true, source: "CCEL", url: "https://ccel.org/ccel/luther/first_prin" },
  { who: "Martin Luther", work: "Preface to the Epistle to the Romans", free: true, source: "CCEL", url: "https://www.ccel.org/l/luther/romans/pref_romans.html" },
  { who: "Pseudo-Dionysius", work: "The Divine Names and The Mystical Theology", free: true, source: "CCEL", url: "https://ccel.org/ccel/dionysius/works" },
  { who: "Richard Hooker", work: "Of the Laws of Ecclesiastical Polity (Books I–IV)", free: true, source: "Online Library of Liberty", url: "https://oll.libertyfund.org/titles/walton-the-works-of-richard-hooker-vol-1" },
  { who: "Thomas Aquinas", work: "Summa Contra Gentiles", free: true, source: "Isidore.co", url: "https://isidore.co/aquinas/ContraGentiles.htm" },
  { who: "Thomas Aquinas", work: "Summa Theologiae", free: true, source: "New Advent", url: "https://www.newadvent.org/summa/" },

  // Confessions and catechisms (free to read on official or long-standing sites)
  { who: "Assemblies of God", work: "Statement of Fundamental Truths", free: true, source: "Assemblies of God", url: "https://ag.org/Beliefs/Statement-of-Fundamental-Truths" },
  { who: "Catholic Church", work: "Catechism of the Catholic Church", free: true, source: "The Vatican", url: "https://www.vatican.va/archive/ENG0015/_INDEX.HTM" },
  { who: "Church of England", work: "The Book of Common Prayer (1662)", free: true, source: "Church of England", url: "https://www.churchofengland.org/prayer-and-worship/worship-texts-and-resources/book-common-prayer" },
  { who: "Church of England", work: "The Thirty-Nine Articles", free: true, source: "Church of England", url: "https://www.churchofengland.org/prayer-and-worship/worship-texts-and-resources/book-common-prayer/articles-religion" },
  { who: "Lutheran Church", work: "The Book of Concord (Augsburg Confession, Small and Large Catechisms)", cites: ["The Book of Concord (including the Augsburg Confession)", "Martin Luther, Small and Large Catechisms"], free: true, source: "BookOfConcord.org", url: "https://bookofconcord.org/" },
  { who: "Reformed Churches", work: "Heidelberg Catechism", free: true, source: "Christian Reformed Church", url: "https://www.crcna.org/welcome/beliefs/confessions/heidelberg-catechism" },
  { who: "Southern Baptist Convention", work: "The Baptist Faith and Message (2000)", free: true, source: "SBC", url: "https://bfm.sbc.net/bfm2000/" },
  { who: "Particular Baptists", work: "Second London Baptist Confession (1689)", free: true, source: "the1689confession.com", url: "https://www.the1689confession.com/" },
  { who: "United Methodist Church", work: "The Methodist Articles of Religion", free: true, source: "UMC", url: "https://www.umc.org/en/content/articles-of-religion" },
  { who: "Westminster Assembly", work: "Westminster Confession of Faith and Catechisms", free: true, source: "PCA (PDF)", url: "https://www.pcaac.org/bco/westminster-confession/" },

  // ───── Still in copyright (find a copy) ─────
  { who: "Alvin Plantinga", work: "God, Freedom, and Evil", free: false },
  { who: "Augustine", work: "On Free Choice of the Will", free: false, note: "Modern English translations are in copyright." },
  { who: "Brant Pitre", work: "Jesus and the Jewish Roots of the Eucharist", free: false },
  { who: "C.S. Lewis", work: "Mere Christianity", free: false },
  { who: "Cyril of Alexandria", work: "On the Unity of Christ", free: false, note: "The standard English translation is in copyright." },
  { who: "D.A. Carson", work: "How Long, O Lord?", free: false },
  { who: "Dietrich Bonhoeffer", work: "Discipleship (The Cost of Discipleship)", free: false },
  { who: "Dietrich Bonhoeffer", work: "Life Together", free: false },
  { who: "G.K. Beale", work: "The Temple and the Church's Mission", free: false },
  { who: "Gordon Fee", work: "God's Empowering Presence", free: false },
  { who: "Gustaf Aulén", work: "Christus Victor", free: false },
  { who: "Henri Nouwen", work: "The Return of the Prodigal Son", free: false },
  { who: "J.I. Packer", work: "Keep in Step with the Spirit", free: false },
  { who: "John Stott", work: "Basic Christianity", free: false },
  { who: "John Stott", work: "The Cross of Christ", free: false },
  { who: "Jürgen Moltmann", work: "The Crucified God", free: false },
  { who: "Luis de Molina", work: "On Divine Foreknowledge (Part IV of the Concordia)", free: false, note: "The English translation is in copyright." },
  { who: "Martin Luther", work: "A Simple Way to Pray", free: false, note: "Modern English translations are in copyright." },
  { who: "Melito of Sardis", work: "On Pascha", free: false, note: "Rediscovered in the 1900s; English translations are in copyright." },
  { who: "N.T. Wright", work: "Jesus and the Victory of God", free: false },
  { who: "N.T. Wright", work: "Surprised by Hope", free: false },
  { who: "O. Palmer Robertson", work: "The Christ of the Covenants", free: false },
  { who: "Richard Bauckham", work: "Jesus and the God of Israel", free: false },
  { who: "Scott Hahn", work: "Kinship by Covenant", free: false },
  { who: "Sinclair Ferguson", work: "The Holy Spirit", free: false },
  { who: "Søren Kierkegaard", work: "Fear and Trembling", free: false, note: "Common English translations are in copyright." },
  { who: "Thomas Weinandy", work: "Does God Suffer?", free: false },
  { who: "Timothy Keller", work: "The Prodigal God", free: false },
  { who: "Timothy (Kallistos) Ware", work: "The Orthodox Church", free: false },
  { who: "Yves Congar", work: "The Mystery of the Temple", free: false }
];
