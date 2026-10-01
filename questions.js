// Seek Like Silver — question bank
//
// Each question has:
//   id          – permanent ID (never reuse or change one; saved answers point to it)
//   prompt      – the question itself, with no verse references in it
//   passage     – "In question": the Scripture the question is about
//   inspiration – "Inspiration": other Scripture that helps you answer
//   readings    – "Look up": theologians, each pointed to a SPECIFIC work, never a paraphrased quote
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

const QUESTIONS = {
  beginner: [
    {
      id: "b1",
      prompt: "John's Gospel opens by calling Jesus \"the Word.\" Who is the Word, and what does it mean that the Word \"became flesh\"?",
      passage: ["John 1:1-14"],
      inspiration: ["Philippians 2:5-8", "Colossians 1:15-20", "Hebrews 1:1-3"],
      readings: [
        { who: "Athanasius", work: "On the Incarnation" },
        { who: "C.S. Lewis", work: "Mere Christianity, Book 4" }
      ]
    },
    {
      id: "b2",
      prompt: "What does it mean for human beings to be made in the image of God?",
      passage: ["Genesis 1:26-28"],
      inspiration: ["Genesis 9:6", "Psalm 8:3-8", "James 3:9", "Colossians 3:10"],
      readings: [
        { who: "Irenaeus of Lyons", work: "Against Heresies, Book 5" },
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 1, ch. 15" }
      ]
    },
    {
      id: "b3",
      prompt: "In the parable of the prodigal son, what does the father's response to his returning son teach about God?",
      passage: ["Luke 15:11-32"],
      inspiration: ["Psalm 103:8-13", "Romans 5:8", "Luke 15:1-7"],
      readings: [
        { who: "Henri Nouwen", work: "The Return of the Prodigal Son" },
        { who: "Timothy Keller", work: "The Prodigal God" }
      ]
    },
    {
      id: "b4",
      prompt: "In the parable of the Good Samaritan, Jesus answers the question \"Who is my neighbor?\" What is his answer, and what does it ask of us?",
      passage: ["Luke 10:25-37"],
      inspiration: ["Leviticus 19:18", "Leviticus 19:33-34", "1 John 4:19-21"],
      readings: [
        { who: "Augustine", work: "On Christian Doctrine, Book 1" },
        { who: "Dietrich Bonhoeffer", work: "Life Together" }
      ]
    },
    {
      id: "b5",
      prompt: "How is a person saved, and where do good works fit in?",
      passage: ["Ephesians 2:8-10"],
      inspiration: ["Titus 3:4-7", "Romans 3:23-24", "James 2:14-26"],
      readings: [
        { who: "Martin Luther", work: "The Freedom of a Christian" },
        { who: "Augustine", work: "On the Spirit and the Letter" }
      ]
    },
    {
      id: "b6",
      prompt: "What does the Lord's Prayer teach us about what prayer is and what we should pray for?",
      passage: ["Matthew 6:5-13"],
      inspiration: ["Luke 11:1-13", "Philippians 4:6-7", "Romans 8:26"],
      readings: [
        { who: "Cyprian of Carthage", work: "On the Lord's Prayer" },
        { who: "Martin Luther", work: "A Simple Way to Pray" }
      ]
    },
    {
      id: "b7",
      prompt: "This psalm describes God as a shepherd. What does that image teach about how God cares for his people?",
      passage: ["Psalm 23"],
      inspiration: ["John 10:11-15", "Ezekiel 34:11-16", "Isaiah 40:11"],
      readings: [
        { who: "Charles Spurgeon", work: "The Treasury of David, on Psalm 23" },
        { who: "Augustine", work: "Expositions on the Psalms" }
      ]
    },
    {
      id: "b8",
      prompt: "Why did Jesus die? What reasons do Paul's summary of the gospel and Isaiah's prophecy of the suffering servant give?",
      passage: ["1 Corinthians 15:3-8", "Isaiah 53:4-6"],
      inspiration: ["Mark 10:45", "Romans 5:6-8", "1 Peter 2:24"],
      readings: [
        { who: "Athanasius", work: "On the Incarnation" },
        { who: "John Stott", work: "The Cross of Christ" }
      ]
    },
    {
      id: "b9",
      prompt: "What does Jesus say the Holy Spirit will do for his followers?",
      passage: ["John 14:15-27", "John 16:7-15"],
      inspiration: ["Galatians 5:22-23", "Romans 8:14-16", "Acts 1:8"],
      readings: [
        { who: "Basil of Caesarea", work: "On the Holy Spirit" },
        { who: "J.I. Packer", work: "Keep in Step with the Spirit" }
      ]
    },
    {
      id: "b10",
      prompt: "What would be lost if Jesus had not risen from the dead? What does his resurrection change?",
      passage: ["1 Corinthians 15:12-22"],
      inspiration: ["Romans 6:4-5", "1 Peter 1:3", "John 11:25-26"],
      readings: [
        { who: "N.T. Wright", work: "Surprised by Hope" },
        { who: "Athanasius", work: "On the Incarnation" }
      ]
    },
    {
      id: "b11",
      prompt: "What does the Bible's opening account of creation teach about who God is and what kind of world he made?",
      passage: ["Genesis 1", "Genesis 2:1-3"],
      inspiration: ["Psalm 104:24-30", "Psalm 33:6-9", "John 1:1-3"],
      readings: [
        { who: "Basil of Caesarea", work: "Hexaemeron (Homilies on the Six Days of Creation)" },
        { who: "Augustine", work: "Confessions, Books 11–13" }
      ]
    },
    {
      id: "b12",
      prompt: "What happened in the garden? How did the first sin change humanity's relationship with God, with each other, and with the world?",
      passage: ["Genesis 3"],
      inspiration: ["Romans 5:12", "Romans 8:20-22", "1 Corinthians 15:21-22"],
      readings: [
        { who: "Augustine", work: "City of God, Book 14" },
        { who: "C.S. Lewis", work: "The Problem of Pain, ch. 5" }
      ]
    },
    {
      id: "b13",
      prompt: "What do the Ten Commandments show about God and how his people should live? Why does God remind them he rescued them from Egypt before giving the commands?",
      passage: ["Exodus 20:1-17"],
      inspiration: ["Matthew 22:36-40", "Romans 13:8-10", "Psalm 19:7-11"],
      readings: [
        { who: "Martin Luther", work: "Large Catechism, Part 1 (The Ten Commandments)" },
        { who: "Reformed Churches", work: "Heidelberg Catechism, Q&A 92–115" }
      ]
    },
    {
      id: "b14",
      prompt: "Jesus called loving God with all your heart, soul, and mind the greatest commandment. What does it mean to love God this way, and why is loving your neighbor \"like it\"?",
      passage: ["Matthew 22:34-40"],
      inspiration: ["Deuteronomy 6:4-9", "Leviticus 19:18", "1 John 4:7-12"],
      readings: [
        { who: "Bernard of Clairvaux", work: "On Loving God" },
        { who: "Augustine", work: "On Christian Doctrine, Book 1" }
      ]
    },
    {
      id: "b15",
      prompt: "What kind of people does Jesus call \"blessed\" in the Beatitudes, and why might that have surprised the people listening?",
      passage: ["Matthew 5:1-12"],
      inspiration: ["Luke 6:20-26", "Isaiah 61:1-3", "Psalm 37:11"],
      readings: [
        { who: "Augustine", work: "Our Lord's Sermon on the Mount, Book 1" },
        { who: "Dietrich Bonhoeffer", work: "Discipleship (The Cost of Discipleship)" }
      ]
    },
    {
      id: "b16",
      prompt: "Jesus tells Nicodemus that he must be \"born again\" (or \"born from above\"). What does Jesus mean, and how does it happen?",
      passage: ["John 3:1-21"],
      inspiration: ["Ezekiel 36:25-27", "2 Corinthians 5:17", "1 Peter 1:3", "Titus 3:4-7"],
      readings: [
        { who: "John Chrysostom", work: "Homilies on the Gospel of John" },
        { who: "John Wesley", work: "Sermons on Several Occasions, \"The New Birth\"" }
      ]
    },
    {
      id: "b17",
      prompt: "What is faith, according to this chapter? What do the examples of Abraham, Moses, and the others show about it?",
      passage: ["Hebrews 11"],
      inspiration: ["Genesis 15:1-6", "Genesis 22:1-18", "Romans 4:18-22"],
      readings: [
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 3, ch. 2" },
        { who: "Martin Luther", work: "Preface to the Epistle to the Romans" }
      ]
    },
    {
      id: "b18",
      prompt: "Paul contrasts the \"works of the flesh\" with the \"fruit of the Spirit.\" What is the difference, and how does that fruit grow in a believer?",
      passage: ["Galatians 5:16-26"],
      inspiration: ["John 15:1-8", "Romans 8:5-11", "Colossians 3:12-17"],
      readings: [
        { who: "J.I. Packer", work: "Keep in Step with the Spirit" },
        { who: "Gordon Fee", work: "God's Empowering Presence" }
      ]
    },
    {
      id: "b19",
      prompt: "Paul says even the greatest gifts are worthless without love. What does he say love is, and why does he call it greater than even faith and hope?",
      passage: ["1 Corinthians 13"],
      inspiration: ["1 John 4:7-21", "John 13:34-35", "Romans 13:8-10"],
      readings: [
        { who: "Augustine", work: "Homilies on the First Epistle of John" },
        { who: "C.S. Lewis", work: "The Four Loves" }
      ]
    },
    {
      id: "b20",
      prompt: "David prayed this psalm after his sin with Bathsheba. What does it teach about sin, confession, and forgiveness?",
      passage: ["Psalm 51"],
      inspiration: ["2 Samuel 12:1-13", "1 John 1:8-9", "Luke 18:9-14"],
      readings: [
        { who: "Augustine", work: "Expositions on the Psalms, on Psalm 51 (his Psalm 50)" },
        { who: "Dietrich Bonhoeffer", work: "Life Together, ch. 5 (Confession and Communion)" }
      ]
    },
    {
      id: "b21",
      prompt: "Jesus tells his followers not to worry. What reasons does he give for trusting God instead, and what does he tell us to seek first?",
      passage: ["Matthew 6:25-34"],
      inspiration: ["1 Peter 5:6-7", "Psalm 55:22", "Philippians 4:6-7"],
      readings: [
        { who: "Augustine", work: "Our Lord's Sermon on the Mount, Book 2" },
        { who: "Jean-Pierre de Caussade", work: "Abandonment to Divine Providence" }
      ]
    },
    {
      id: "b22",
      prompt: "Before he ascended, Jesus gave his followers a mission. What did he command them to do, and what promise did he attach to it?",
      passage: ["Matthew 28:16-20"],
      inspiration: ["Acts 1:6-11", "Genesis 12:1-3", "Romans 10:13-15"],
      readings: [
        { who: "John Stott", work: "Christian Mission in the Modern World" },
        { who: "Lesslie Newbigin", work: "The Open Secret" }
      ]
    },
    {
      id: "b23",
      prompt: "Paul says believers were \"baptized into Christ's death.\" What does baptism picture or do, according to the New Testament?",
      passage: ["Romans 6:1-11"],
      inspiration: ["Matthew 3:13-17", "Acts 2:38-41", "Colossians 2:11-12", "1 Peter 3:21"],
      readings: [
        { who: "Tertullian", work: "On Baptism" },
        { who: "Cyril of Jerusalem", work: "Catechetical Lectures, Mystagogical Lectures 1–2 (Lectures 19–20)" }
      ]
    },
    {
      id: "b24",
      prompt: "What did Jesus say and do at the Last Supper, and what do Christians proclaim whenever they share the bread and the cup?",
      passage: ["1 Corinthians 11:23-26"],
      inspiration: ["Luke 22:14-20", "1 Corinthians 10:16-17", "John 6:35"],
      readings: [
        { who: "Early Church", work: "The Didache, chs. 9–10 and 14" },
        { who: "Justin Martyr", work: "First Apology, chs. 65–67" }
      ]
    },
    {
      id: "b25",
      prompt: "Paul compares the church to a body with many parts. What does this picture teach about how believers belong to each other?",
      passage: ["1 Corinthians 12:12-27"],
      inspiration: ["Romans 12:3-8", "Ephesians 4:11-16", "1 Peter 4:10-11"],
      readings: [
        { who: "Clement of Rome", work: "First Epistle to the Corinthians (1 Clement), chs. 37–38" },
        { who: "Dietrich Bonhoeffer", work: "Life Together" }
      ]
    },
    {
      id: "b26",
      prompt: "What is \"the armor of God,\" and what does it teach about the spiritual struggle Christians face?",
      passage: ["Ephesians 6:10-18"],
      inspiration: ["Isaiah 59:15-17", "1 Peter 5:8-9", "James 4:7-8"],
      readings: [
        { who: "William Gurnall", work: "The Christian in Complete Armour" },
        { who: "C.S. Lewis", work: "The Screwtape Letters" }
      ]
    },
    {
      id: "b27",
      prompt: "What does Jonah's story teach about God's mercy? Why is Jonah angry when God spares Nineveh, and how does God answer him?",
      passage: ["Jonah 3", "Jonah 4"],
      inspiration: ["Exodus 34:6-7", "Matthew 12:38-41", "Luke 15:25-32"],
      readings: [
        { who: "Timothy Keller", work: "The Prodigal Prophet" },
        { who: "John Calvin", work: "Commentaries on the Twelve Minor Prophets, on Jonah" }
      ]
    },
    {
      id: "b28",
      prompt: "After Jesus calms the storm, his disciples ask, \"Who is this?\" How would you answer them from this passage and the Old Testament?",
      passage: ["Mark 4:35-41"],
      inspiration: ["Psalm 107:23-30", "Psalm 89:8-9", "Mark 6:45-52"],
      readings: [
        { who: "Richard Bauckham", work: "Jesus and the God of Israel" },
        { who: "C.S. Lewis", work: "Miracles" }
      ]
    },
    {
      id: "b29",
      prompt: "Why did Jesus wash his disciples' feet, and what did he want them to learn from it?",
      passage: ["John 13:1-17"],
      inspiration: ["Philippians 2:3-8", "Mark 10:42-45", "Luke 22:24-27"],
      readings: [
        { who: "Augustine", work: "Tractates on the Gospel of John, 55–59" },
        { who: "Andrew Murray", work: "Humility" }
      ]
    },
    {
      id: "b30",
      prompt: "How does the Bible's final vision describe the future God has promised? What will be there, and what will be gone?",
      passage: ["Revelation 21:1-7", "Revelation 22:1-5"],
      inspiration: ["Isaiah 65:17-25", "Romans 8:18-23", "2 Peter 3:13"],
      readings: [
        { who: "N.T. Wright", work: "Surprised by Hope" },
        { who: "Augustine", work: "City of God, Book 22" }
      ]
    }
  ],

  moderate: [
    {
      id: "m1",
      prompt: "How does the Passover help explain the Last Supper and the meaning of Jesus' death?",
      passage: ["Exodus 12:1-14", "Luke 22:7-20"],
      inspiration: ["1 Corinthians 5:7", "John 1:29", "John 19:31-36"],
      readings: [
        { who: "Melito of Sardis", work: "On Pascha" },
        { who: "Brant Pitre", work: "Jesus and the Jewish Roots of the Eucharist" }
      ]
    },
    {
      id: "m2",
      prompt: "Paul says a person is justified by faith apart from works of the law. James says a person is justified by works and not by faith alone. How do these fit together?",
      passage: ["Romans 3:21-28", "James 2:14-26"],
      inspiration: ["Galatians 5:6", "Genesis 15:6", "Ephesians 2:8-10"],
      readings: [
        { who: "Martin Luther", work: "Preface to the Epistle to the Romans" },
        { who: "Council of Trent", work: "Session 6, Decree on Justification" },
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 3, ch. 17" }
      ]
    },
    {
      id: "m3",
      prompt: "How does God's covenant with Abraham shape Paul's argument about who belongs to God's family?",
      passage: ["Genesis 12:1-3", "Galatians 3:6-29"],
      inspiration: ["Genesis 15:6", "Genesis 17:1-8", "Romans 4"],
      readings: [
        { who: "O. Palmer Robertson", work: "The Christ of the Covenants" },
        { who: "Scott Hahn", work: "Kinship by Covenant" }
      ]
    },
    {
      id: "m4",
      prompt: "Trace the theme of God dwelling with his people from Eden to the tabernacle, the temple, Jesus, the church, and the new creation. What does this story reveal?",
      passage: ["Exodus 40:34-38", "John 1:14", "Revelation 21:3"],
      inspiration: ["Genesis 3:8", "1 Kings 8:10-11", "1 Corinthians 3:16", "Ezekiel 43:1-7"],
      readings: [
        { who: "G.K. Beale", work: "The Temple and the Church's Mission" },
        { who: "Yves Congar", work: "The Mystery of the Temple" }
      ]
    },
    {
      id: "m5",
      prompt: "The title Jesus used most often for himself was \"Son of Man.\" How does Daniel's vision shape what that title means, and why did Jesus' use of it at his trial provoke such a reaction?",
      passage: ["Daniel 7:13-14", "Mark 14:61-64"],
      inspiration: ["Matthew 26:64", "Mark 2:10", "Mark 8:31"],
      readings: [
        { who: "N.T. Wright", work: "Jesus and the Victory of God" },
        { who: "Richard Bauckham", work: "Jesus and the God of Israel" }
      ]
    },
    {
      id: "m6",
      prompt: "Job's friends assume his suffering must be punishment for sin. How do Job's story and Jesus' own words challenge that assumption?",
      passage: ["Job 1-2", "John 9:1-3"],
      inspiration: ["Job 38-42", "Luke 13:1-5", "2 Corinthians 4:16-18"],
      readings: [
        { who: "Gregory the Great", work: "Moralia in Job" },
        { who: "D.A. Carson", work: "How Long, O Lord?" }
      ]
    },
    {
      id: "m7",
      prompt: "How does the Day of Atonement help explain what the letter to the Hebrews says about Jesus as our high priest?",
      passage: ["Leviticus 16", "Hebrews 9:11-14"],
      inspiration: ["Hebrews 4:14-16", "Hebrews 10:1-14", "Romans 3:25"],
      readings: [
        { who: "John Chrysostom", work: "Homilies on Hebrews" },
        { who: "John Owen", work: "An Exposition of the Epistle to the Hebrews" }
      ]
    },
    {
      id: "m8",
      prompt: "Paul sets Adam and Christ side by side. What does each one bring to humanity, and why does Paul compare them?",
      passage: ["Romans 5:12-21", "1 Corinthians 15:21-22"],
      inspiration: ["1 Corinthians 15:45-49", "Genesis 3", "Genesis 2:15-17"],
      readings: [
        { who: "Irenaeus of Lyons", work: "Against Heresies, Book 3" },
        { who: "Augustine", work: "City of God, Book 13" }
      ]
    },
    {
      id: "m9",
      prompt: "How does Pentecost relate to the Tower of Babel and to the prophet Joel's promise?",
      passage: ["Acts 2:1-21"],
      inspiration: ["Genesis 11:1-9", "Joel 2:28-32", "Numbers 11:24-29"],
      readings: [
        { who: "Cyril of Jerusalem", work: "Catechetical Lectures 16–17" },
        { who: "Sinclair Ferguson", work: "The Holy Spirit" }
      ]
    },
    {
      id: "m10",
      prompt: "Jesus said he came not to abolish the Law but to fulfill it. In the Sermon on the Mount, how does he relate to the Law of Moses?",
      passage: ["Matthew 5:17-48"],
      inspiration: ["Jeremiah 31:31-34", "Romans 10:4", "Romans 13:8-10"],
      readings: [
        { who: "Augustine", work: "Our Lord's Sermon on the Mount" },
        { who: "Dietrich Bonhoeffer", work: "Discipleship (The Cost of Discipleship)" }
      ]
    },
    {
      id: "m11",
      prompt: "Who is Melchizedek, and why does Hebrews use this mysterious figure to explain Jesus' priesthood?",
      passage: ["Hebrews 7"],
      inspiration: ["Genesis 14:17-20", "Psalm 110", "Hebrews 5:5-10"],
      readings: [
        { who: "John Chrysostom", work: "Homilies on Hebrews" },
        { who: "John Owen", work: "An Exposition of the Epistle to the Hebrews" }
      ]
    },
    {
      id: "m12",
      prompt: "How do Isaiah's \"Servant\" passages help the New Testament explain who Jesus is and what he came to do?",
      passage: ["Isaiah 52:13-15", "Isaiah 53"],
      inspiration: ["Isaiah 42:1-4", "Matthew 12:15-21", "Acts 8:26-35", "1 Peter 2:21-25"],
      readings: [
        { who: "Justin Martyr", work: "Dialogue with Trypho, ch. 13" },
        { who: "John Stott", work: "The Cross of Christ" }
      ]
    },
    {
      id: "m13",
      prompt: "The exodus from Egypt is the Old Testament's great story of rescue. How do the prophets and the New Testament use it to describe salvation in Christ?",
      passage: ["Exodus 14"],
      inspiration: ["Isaiah 43:16-19", "Luke 9:28-31", "1 Corinthians 10:1-4"],
      readings: [
        { who: "Melito of Sardis", work: "On Pascha" },
        { who: "Gregory of Nyssa", work: "The Life of Moses" }
      ]
    },
    {
      id: "m14",
      prompt: "God promised David a son whose throne would last forever. How does that promise shape the way the New Testament presents Jesus?",
      passage: ["2 Samuel 7:8-16"],
      inspiration: ["Psalm 89:3-4", "Isaiah 9:6-7", "Luke 1:30-33", "Acts 2:29-36"],
      readings: [
        { who: "Augustine", work: "City of God, Book 17" },
        { who: "O. Palmer Robertson", work: "The Christ of the Covenants" }
      ]
    },
    {
      id: "m15",
      prompt: "Genesis says humans were made in God's image; Paul calls Christ \"the image of God.\" How does the New Testament connect the two, and what does it say God is doing to that image in us?",
      passage: ["2 Corinthians 3:18", "2 Corinthians 4:1-6"],
      inspiration: ["Genesis 1:26-27", "Colossians 1:15", "Romans 8:29", "Colossians 3:9-10"],
      readings: [
        { who: "Athanasius", work: "On the Incarnation, chs. 11–14" },
        { who: "Gregory of Nyssa", work: "On the Making of Man" }
      ]
    },
    {
      id: "m16",
      prompt: "Jesus announced that \"the kingdom of God has come near.\" What is the kingdom, and how is it both here now and still to come?",
      passage: ["Mark 1:14-15"],
      inspiration: ["Daniel 2:44", "Matthew 13:31-33", "Luke 17:20-21", "Revelation 11:15"],
      readings: [
        { who: "George Eldon Ladd", work: "The Gospel of the Kingdom" },
        { who: "N.T. Wright", work: "Jesus and the Victory of God" }
      ]
    },
    {
      id: "m17",
      prompt: "If no one is made right with God by keeping the Law, why did God give it? How do Paul and the Psalms describe the Law's purpose?",
      passage: ["Galatians 3:19-25"],
      inspiration: ["Romans 7:7-12", "Romans 3:19-20", "Psalm 119:97-105"],
      readings: [
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 2, ch. 7" },
        { who: "Martin Luther", work: "Commentary on Galatians" }
      ]
    },
    {
      id: "m18",
      prompt: "Proverbs pictures Wisdom as present with God at creation. How did the New Testament writers and the early church connect this figure to Christ?",
      passage: ["Proverbs 8:22-31"],
      inspiration: ["1 Corinthians 1:24", "1 Corinthians 1:30", "John 1:1-3", "Colossians 2:2-3"],
      readings: [
        { who: "Athanasius", work: "Four Discourses Against the Arians, Discourse 2" },
        { who: "Augustine", work: "On the Trinity" }
      ]
    },
    {
      id: "m19",
      prompt: "What was the Sabbath for? How does the New Testament treat it after Christ, and why did Christians come to gather on Sunday?",
      passage: ["Mark 2:23-28", "Mark 3:1-6"],
      inspiration: ["Genesis 2:2-3", "Exodus 20:8-11", "Hebrews 4:1-11", "Acts 20:7", "Revelation 1:10"],
      readings: [
        { who: "Ignatius of Antioch", work: "Letter to the Magnesians, ch. 9" },
        { who: "Justin Martyr", work: "First Apology, ch. 67" }
      ]
    },
    {
      id: "m20",
      prompt: "Paul says that Gentile believers have been grafted into Israel's olive tree. How does the New Testament describe the relationship between Israel and the church?",
      passage: ["Romans 11:11-32"],
      inspiration: ["Ephesians 2:11-22", "Galatians 6:15-16", "Jeremiah 31:35-37"],
      readings: [
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 2, chs. 10–11" },
        { who: "Justin Martyr", work: "Dialogue with Trypho" }
      ]
    },
    {
      id: "m21",
      prompt: "Jesus calls himself \"the bread of life.\" How does the manna in the wilderness help explain what he means?",
      passage: ["John 6:25-51"],
      inspiration: ["Exodus 16:1-21", "Deuteronomy 8:3", "Matthew 4:4"],
      readings: [
        { who: "Augustine", work: "Tractates on the Gospel of John, 25–26" },
        { who: "Brant Pitre", work: "Jesus and the Jewish Roots of the Eucharist" }
      ]
    },
    {
      id: "m22",
      prompt: "Where do we find hope of resurrection in the Old Testament, and how did Jesus and the apostles read those texts?",
      passage: ["Daniel 12:1-3"],
      inspiration: ["Job 19:25-27", "Ezekiel 37:1-14", "Isaiah 26:19", "Mark 12:24-27", "Acts 2:24-32"],
      readings: [
        { who: "Athenagoras", work: "On the Resurrection of the Dead" },
        { who: "N.T. Wright", work: "The Resurrection of the Son of God" }
      ]
    },
    {
      id: "m23",
      prompt: "Joseph tells his brothers, \"You meant evil against me, but God meant it for good.\" How does his story show the way God works through human evil, and how does it point toward the cross?",
      passage: ["Genesis 50:15-21"],
      inspiration: ["Genesis 45:4-8", "Acts 4:27-28", "Romans 8:28"],
      readings: [
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 1, chs. 16–18" },
        { who: "Westminster Assembly", work: "Westminster Confession of Faith, ch. 5 (Of Providence)" }
      ]
    },
    {
      id: "m24",
      prompt: "The last of the prophets promised that Elijah would come again before the day of the Lord. How do the Gospels connect that promise to John the Baptist?",
      passage: ["Matthew 11:7-15"],
      inspiration: ["Malachi 4:5-6", "Luke 1:13-17", "Matthew 17:10-13", "John 1:19-23"],
      readings: [
        { who: "John Chrysostom", work: "Homilies on the Gospel of Matthew" },
        { who: "N.T. Wright", work: "Jesus and the Victory of God" }
      ]
    },
    {
      id: "m25",
      prompt: "What does the \"new covenant\" promised by the prophets offer, and how does the New Testament say it is fulfilled?",
      passage: ["Jeremiah 31:31-34"],
      inspiration: ["Ezekiel 36:24-28", "Luke 22:20", "Hebrews 8:6-13", "2 Corinthians 3:4-6"],
      readings: [
        { who: "Augustine", work: "On the Spirit and the Letter" },
        { who: "O. Palmer Robertson", work: "The Christ of the Covenants" }
      ]
    },
    {
      id: "m26",
      prompt: "On the cross Jesus cried, \"My God, my God, why have you forsaken me?\" quoting a psalm. How does the whole psalm shed light on the crucifixion?",
      passage: ["Psalm 22"],
      inspiration: ["Mark 15:33-39", "Matthew 27:35-46", "Hebrews 2:10-12"],
      readings: [
        { who: "Augustine", work: "Expositions on the Psalms, on Psalm 22 (his Psalm 21)" },
        { who: "Charles Spurgeon", work: "The Treasury of David, on Psalm 22" }
      ]
    },
    {
      id: "m27",
      prompt: "Why does Jesus call himself \"the true vine\"? How do the Old Testament's pictures of Israel as God's vine help explain his words?",
      passage: ["John 15:1-11"],
      inspiration: ["Isaiah 5:1-7", "Psalm 80:8-19", "Jeremiah 2:21"],
      readings: [
        { who: "Augustine", work: "Tractates on the Gospel of John, 80–83" },
        { who: "Andrew Murray", work: "Abide in Christ" }
      ]
    },
    {
      id: "m28",
      prompt: "Paul says marriage points to Christ and the church. How does the Bible use marriage to describe God's relationship with his people, from the prophets to Revelation?",
      passage: ["Ephesians 5:21-33"],
      inspiration: ["Hosea 2:14-20", "Isaiah 54:5-8", "Revelation 19:6-9"],
      readings: [
        { who: "Augustine", work: "On the Good of Marriage" },
        { who: "Bernard of Clairvaux", work: "Sermons on the Song of Songs" }
      ]
    },
    {
      id: "m29",
      prompt: "How do the apostles' teachings about Christ's return build on the Old Testament's \"day of the Lord\"? How should that hope shape the way Christians live now?",
      passage: ["1 Thessalonians 4:13-18", "1 Thessalonians 5:1-11"],
      inspiration: ["Amos 5:18-20", "Zephaniah 1:14-16", "Matthew 24:36-44", "2 Peter 3:8-13"],
      readings: [
        { who: "Augustine", work: "City of God, Book 20" },
        { who: "N.T. Wright", work: "Surprised by Hope" }
      ]
    },
    {
      id: "m30",
      prompt: "God told Israel, \"Be holy, for I am holy,\" and Peter repeats it to Christians. What does holiness mean across Scripture, and how is it different from simply being good?",
      passage: ["1 Peter 1:13-25"],
      inspiration: ["Leviticus 19:1-2", "Isaiah 6:1-7", "Hebrews 12:10-14"],
      readings: [
        { who: "J.C. Ryle", work: "Holiness" },
        { who: "John Wesley", work: "A Plain Account of Christian Perfection" }
      ]
    }
  ],

  philosopher: [
    {
      id: "p1",
      prompt: "If God knows everything that will happen, are human choices truly free? How have Christians tried to hold divine foreknowledge and human freedom together?",
      passage: ["Romans 8:28-30", "Acts 2:23"],
      inspiration: ["Romans 9:14-24", "Philippians 2:12-13", "Deuteronomy 30:19"],
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
      passage: ["Genesis 50:20", "Romans 8:18-23"],
      inspiration: ["Job 38:1-11", "Genesis 1:31", "Revelation 21:4"],
      readings: [
        { who: "Augustine", work: "Enchiridion, chs. 10–14" },
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part I, Questions 48–49" },
        { who: "Alvin Plantinga", work: "God, Freedom, and Evil" }
      ]
    },
    {
      id: "p3",
      prompt: "How can God be one and yet three persons without contradiction? What would be lost if we said God is only one person, or three separate gods?",
      passage: ["Deuteronomy 6:4", "Matthew 28:19"],
      inspiration: ["John 1:1", "John 10:30", "2 Corinthians 13:14"],
      readings: [
        { who: "Gregory of Nazianzus", work: "Theological Orations (Orations 27–31)" },
        { who: "Augustine", work: "On the Trinity" },
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part I, Questions 27–43" }
      ]
    },
    {
      id: "p4",
      prompt: "Scripture says God does not change, yet it also describes God grieving and relenting. Does God change, or suffer? What is at stake either way?",
      passage: ["Malachi 3:6", "Genesis 6:5-6", "Hosea 11:8-9"],
      inspiration: ["James 1:17", "Numbers 23:19", "Exodus 32:9-14"],
      readings: [
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part I, Question 9" },
        { who: "Thomas Weinandy", work: "Does God Suffer?" },
        { who: "Jürgen Moltmann", work: "The Crucified God" }
      ]
    },
    {
      id: "p5",
      prompt: "The Council of Chalcedon (451) said Christ is one person in two natures, fully God and fully man. Why did the early church insist on both, and what goes wrong if you lose either one?",
      passage: ["John 1:14", "Philippians 2:5-11"],
      inspiration: ["Hebrews 4:15", "Colossians 2:9", "Hebrews 2:14-18"],
      readings: [
        { who: "Leo the Great", work: "The Tome of Leo" },
        { who: "Cyril of Alexandria", work: "On the Unity of Christ" },
        { who: "Council of Chalcedon", work: "The Chalcedonian Definition (451)" }
      ]
    },
    {
      id: "p6",
      prompt: "When Jesus said \"This is my body,\" what did he mean? How do Catholic, Orthodox, Lutheran, and Reformed Christians understand Christ's presence in the Lord's Supper, and why does it matter?",
      passage: ["Matthew 26:26-28", "John 6:51-58"],
      inspiration: ["1 Corinthians 10:16-17", "1 Corinthians 11:23-29"],
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
      passage: ["Isaiah 55:8-9", "Exodus 3:14"],
      inspiration: ["Romans 11:33-36", "1 Timothy 6:16", "Psalm 145:3"],
      readings: [
        { who: "Pseudo-Dionysius", work: "The Divine Names and The Mystical Theology" },
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part I, Question 13" }
      ]
    },
    {
      id: "p8",
      prompt: "Does faith go beyond reason, against reason, or depend on reason? Can we reason our way to God, or only understand after we believe?",
      passage: ["1 Corinthians 1:18-25", "Acts 17:22-31"],
      inspiration: ["1 Peter 3:15", "Hebrews 11:1-3", "Isaiah 1:18"],
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
      passage: ["Romans 3:23-26", "Colossians 2:13-15"],
      inspiration: ["Mark 10:45", "Hebrews 2:14-15", "Isaiah 53:4-6"],
      readings: [
        { who: "Anselm of Canterbury", work: "Why God Became Man (Cur Deus Homo)" },
        { who: "Gustaf Aulén", work: "Christus Victor" },
        { who: "Athanasius", work: "On the Incarnation" }
      ]
    },
    {
      id: "p10",
      prompt: "Is God outside of time altogether, or does God exist through all time without beginning or end? How would each view change the way we understand prayer and God's knowledge?",
      passage: ["Psalm 90:2-4", "2 Peter 3:8"],
      inspiration: ["Revelation 1:8", "Isaiah 57:15", "John 8:58"],
      readings: [
        { who: "Augustine", work: "Confessions, Book 11" },
        { who: "Boethius", work: "The Consolation of Philosophy, Book 5" }
      ]
    },
    {
      id: "p11",
      prompt: "Does God choose who will be saved because he foresees their faith, or does faith itself flow from God's choice? What is at stake for how we see God's grace and human responsibility?",
      passage: ["Ephesians 1:3-14"],
      inspiration: ["Romans 8:29-30", "John 6:37-44", "1 Timothy 2:3-6", "2 Peter 3:9"],
      readings: [
        { who: "Augustine", work: "On the Predestination of the Saints" },
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 3, chs. 21–24" },
        { who: "Jacobus Arminius", work: "Declaration of Sentiments" }
      ]
    },
    {
      id: "p12",
      prompt: "Can a true believer fall away and be lost? How do Christians read the warnings of this passage alongside the promises that no one can snatch Christ's sheep from his hand?",
      passage: ["Hebrews 6:4-8"],
      inspiration: ["Hebrews 10:26-31", "John 10:27-29", "Romans 8:35-39", "Philippians 1:6"],
      readings: [
        { who: "Westminster Assembly", work: "Westminster Confession of Faith, ch. 17 (Of the Perseverance of the Saints)" },
        { who: "Council of Trent", work: "Session 6, Decree on Justification, chs. 13–15" },
        { who: "Jacobus Arminius", work: "Declaration of Sentiments" }
      ]
    },
    {
      id: "p13",
      prompt: "What is hell? Is it unending conscious punishment, the final destruction of the wicked, or something else? What does each view say about God's justice and love?",
      passage: ["Matthew 25:31-46"],
      inspiration: ["Mark 9:43-48", "2 Thessalonians 1:5-10", "Revelation 20:10-15", "Romans 6:23"],
      readings: [
        { who: "Augustine", work: "City of God, Book 21" },
        { who: "C.S. Lewis", work: "The Problem of Pain, ch. 8" },
        { who: "David L. Edwards and John Stott", work: "Evangelical Essentials" }
      ]
    },
    {
      id: "p14",
      prompt: "Scripture is both God's word and written by human authors. How can it be fully both, and what does that mean for how we handle hard passages and apparent contradictions?",
      passage: ["2 Timothy 3:14-17", "2 Peter 1:19-21"],
      inspiration: ["Luke 1:1-4", "2 Peter 3:15-16", "John 10:35"],
      readings: [
        { who: "Augustine", work: "Letter 82 (to Jerome)" },
        { who: "Second Vatican Council", work: "Dei Verbum (Dogmatic Constitution on Divine Revelation)" },
        { who: "B.B. Warfield", work: "Revelation and Inspiration" }
      ]
    },
    {
      id: "p15",
      prompt: "Is Scripture the only infallible rule for the church, or do Scripture and Tradition together carry authority? How do Protestants, Catholics, and Orthodox answer, and why?",
      passage: ["2 Thessalonians 2:13-15"],
      inspiration: ["Mark 7:6-13", "Acts 15:22-29", "1 Timothy 3:15", "2 Timothy 3:16-17"],
      readings: [
        { who: "Irenaeus of Lyons", work: "Against Heresies, Book 3" },
        { who: "Vincent of Lérins", work: "The Commonitory" },
        { who: "Basil of Caesarea", work: "On the Holy Spirit, ch. 27" },
        { who: "Westminster Assembly", work: "Westminster Confession of Faith, ch. 1 (Of the Holy Scripture)" },
        { who: "Second Vatican Council", work: "Dei Verbum (Dogmatic Constitution on Divine Revelation)" }
      ]
    },
    {
      id: "p16",
      prompt: "Should baptism be given to the infants of believers, or only to people who profess faith themselves? What does each view believe baptism is?",
      passage: ["Acts 2:37-41"],
      inspiration: ["Acts 16:30-34", "Colossians 2:11-12", "Mark 10:13-16", "Genesis 17:9-14"],
      readings: [
        { who: "Tertullian", work: "On Baptism, ch. 18" },
        { who: "Martin Luther", work: "Large Catechism, Part 4 (Baptism)" },
        { who: "Westminster Assembly", work: "Westminster Confession of Faith, ch. 28 (Of Baptism)" },
        { who: "Particular Baptists", work: "Second London Baptist Confession (1689), ch. 29 (Of Baptism)" }
      ]
    },
    {
      id: "p17",
      prompt: "Is it right to use images of Christ and the saints in worship? How did the church settle the iconoclast controversy, and why do many Protestants still disagree?",
      passage: ["Exodus 20:4-6"],
      inspiration: ["Exodus 25:18-22", "Numbers 21:8-9", "2 Kings 18:4", "Colossians 1:15"],
      readings: [
        { who: "John of Damascus", work: "Apologies Against Those Who Decry Holy Images" },
        { who: "Second Council of Nicaea", work: "Decree of the Second Council of Nicaea (787)" },
        { who: "Reformed Churches", work: "Heidelberg Catechism, Q&A 96–98" },
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 1, ch. 11" }
      ]
    },
    {
      id: "p18",
      prompt: "Why did the Council of Ephesus (431) call Mary \"Theotokos,\" the God-bearer? Is that title mainly a claim about Mary, or about Christ?",
      passage: ["Luke 1:26-45"],
      inspiration: ["Galatians 4:4-5", "John 1:14", "Matthew 1:18-23"],
      readings: [
        { who: "Cyril of Alexandria", work: "Third Letter to Nestorius" },
        { who: "Cyril of Alexandria", work: "On the Unity of Christ" }
      ]
    },
    {
      id: "p19",
      prompt: "Are miracles violations of the laws of nature? How have Christians answered skeptics of miracles, and what do miracles reveal about God and the world?",
      passage: ["John 20:30-31"],
      inspiration: ["John 2:1-11", "Acts 2:22", "1 Corinthians 15:14-17", "Colossians 1:16-17"],
      readings: [
        { who: "Augustine", work: "City of God, Book 21, chs. 5–8" },
        { who: "Thomas Aquinas", work: "Summa Contra Gentiles, Book 3, chs. 98–103" },
        { who: "C.S. Lewis", work: "Miracles" }
      ]
    },
    {
      id: "p20",
      prompt: "Paul says Gentiles who never had the Law still show its work written on their hearts. Is there a moral law everyone can know, and how much can people know about God without the Bible?",
      passage: ["Romans 1:18-32", "Romans 2:12-16"],
      inspiration: ["Psalm 19:1-4", "Acts 14:15-17", "Acts 17:24-28"],
      readings: [
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part I-II, Question 94" },
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 1, chs. 3–5" },
        { who: "C.S. Lewis", work: "Mere Christianity, Book 1" },
        { who: "Emil Brunner and Karl Barth", work: "Natural Theology (Nature and Grace / No!)" }
      ]
    },
    {
      id: "p21",
      prompt: "What did we inherit from Adam: his guilt, or the death and corruption his sin brought into human nature? How do Augustine and the Eastern Orthodox tradition differ on \"original sin,\" and why did the church reject the idea that we inherit nothing at all?",
      passage: ["Romans 5:12-19"],
      inspiration: ["Psalm 51:5", "Ephesians 2:1-3", "Ezekiel 18:20", "1 Corinthians 15:22"],
      readings: [
        { who: "Augustine", work: "On the Merits and Forgiveness of Sins, and on the Baptism of Infants" },
        { who: "Council of Trent", work: "Session 5, Decree on Original Sin" },
        { who: "Timothy (Kallistos) Ware", work: "The Orthodox Church" }
      ]
    },
    {
      id: "p22",
      prompt: "Can a Christian become free of willful sin in this life, or will believers struggle until death? Who is the \"wretched man\" in this passage: Paul as a Christian, Paul before Christ, or someone else?",
      passage: ["Romans 7:14-25"],
      inspiration: ["1 John 1:8-10", "1 John 3:6-9", "Matthew 5:48", "Philippians 3:12-15"],
      readings: [
        { who: "Augustine", work: "Against Two Letters of the Pelagians, Book 1" },
        { who: "John Wesley", work: "A Plain Account of Christian Perfection" },
        { who: "John Owen", work: "Of the Mortification of Sin in Believers" }
      ]
    },
    {
      id: "p23",
      prompt: "If God already knows what we need and has already decided what he will do, why pray? Can prayer change anything?",
      passage: ["James 5:13-18"],
      inspiration: ["Matthew 6:7-8", "Luke 18:1-8", "Genesis 18:22-33", "Exodus 32:9-14"],
      readings: [
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part II-II, Question 83" },
        { who: "Blaise Pascal", work: "Pensées" },
        { who: "Tertullian", work: "On Prayer" }
      ]
    },
    {
      id: "p24",
      prompt: "Classical theologians taught that God is \"simple\": without parts, so that his goodness, wisdom, and being are all one. Why did they insist on this, and why have some modern thinkers questioned it?",
      passage: ["Exodus 3:13-15", "1 John 4:8"],
      inspiration: ["Deuteronomy 6:4", "James 1:17", "1 John 1:5"],
      readings: [
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part I, Question 3" },
        { who: "Anselm of Canterbury", work: "Proslogion, chs. 18–22" },
        { who: "Alvin Plantinga", work: "Does God Have a Nature?" }
      ]
    },
    {
      id: "p25",
      prompt: "Can a Christian fight in a war? How have some Christians drawn on Scripture to defend \"just war,\" and others to defend nonviolence?",
      passage: ["Matthew 5:38-48", "Romans 13:1-7"],
      inspiration: ["Romans 12:17-21", "Luke 3:14", "Matthew 26:51-52"],
      readings: [
        { who: "Augustine", work: "City of God, Book 19, ch. 7" },
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part II-II, Question 40" },
        { who: "Stanley Hauerwas", work: "The Peaceable Kingdom" }
      ]
    },
    {
      id: "p26",
      prompt: "The apostles proclaimed that salvation is found in no one but Christ. What then of people who never hear the gospel? How have Christians answered, and what is at stake?",
      passage: ["Acts 4:12"],
      inspiration: ["John 14:6", "Romans 10:13-17", "Acts 10:34-35", "1 Timothy 2:3-6"],
      readings: [
        { who: "Catholic Church", work: "Catechism of the Catholic Church, paragraphs 846–848" },
        { who: "Westminster Assembly", work: "Westminster Confession of Faith, ch. 10 (Of Effectual Calling)" },
        { who: "C.S. Lewis", work: "Mere Christianity, Book 2, ch. 5" }
      ]
    },
    {
      id: "p27",
      prompt: "How should we read the days of creation? What have Christians, from the church fathers to the Reformers, made of how Genesis describes the making of the world?",
      passage: ["Genesis 1", "Genesis 2:1-4"],
      inspiration: ["Exodus 20:11", "Psalm 90:4", "Hebrews 11:3"],
      readings: [
        { who: "Basil of Caesarea", work: "Hexaemeron (Homilies on the Six Days of Creation)" },
        { who: "Augustine", work: "The Literal Meaning of Genesis" },
        { who: "John Calvin", work: "Commentary on Genesis" }
      ]
    },
    {
      id: "p28",
      prompt: "Are human beings souls who have bodies, or embodied creatures whose hope is resurrection? What happens to a person between death and the resurrection?",
      passage: ["2 Corinthians 5:1-10"],
      inspiration: ["Genesis 2:7", "Luke 23:42-43", "Philippians 1:21-24", "1 Corinthians 15:42-44"],
      readings: [
        { who: "Thomas Aquinas", work: "Summa Theologiae, Part I, Questions 75–76" },
        { who: "Tertullian", work: "A Treatise on the Soul" },
        { who: "N.T. Wright", work: "Surprised by Hope" }
      ]
    },
    {
      id: "p29",
      prompt: "The Creed confesses \"one, holy, catholic, and apostolic Church.\" What makes the church one, and why do Christians disagree about where that church is found?",
      passage: ["Ephesians 4:1-16"],
      inspiration: ["John 17:20-23", "Matthew 16:13-19", "1 Corinthians 1:10-13"],
      readings: [
        { who: "Cyprian of Carthage", work: "On the Unity of the Church" },
        { who: "John Calvin", work: "Institutes of the Christian Religion, Book 4, chs. 1–2" },
        { who: "Timothy (Kallistos) Ware", work: "The Orthodox Church" }
      ]
    },
    {
      id: "p30",
      prompt: "Isaiah calls God \"a God who hides himself.\" If God wants to be known, why isn't he more obvious? What might God's hiddenness be for?",
      passage: ["Isaiah 45:15-19"],
      inspiration: ["Psalm 13:1-2", "Romans 1:19-20", "Acts 17:26-27", "John 20:29"],
      readings: [
        { who: "Blaise Pascal", work: "Pensées" },
        { who: "Søren Kierkegaard", work: "Philosophical Fragments" }
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
