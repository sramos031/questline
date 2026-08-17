
import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Coins,
  Crown,
  Dices,
  Flame,
  Footprints,
  Gift,
  Gem,
  Heart,
  Pause,
  Play,
  Plus,
  RotateCcw,
  ScrollText,
  Shield,
  Sparkles,
  Swords,
  Trash2,
  Volume2,
  WandSparkles,
  X
} from "lucide-react";

const lessons = [
  { title: "Shrink the starting line", body: "Replace “finish the quest” with one visible action, such as opening the file and writing one heading." },
  { title: "Externalize time", body: "Use the campfire timer and its gentle chime. The goal is awareness, not pressure." },
  { title: "Leave a trail marker", body: "Before resting, write the exact next physical action so returning to the quest requires fewer decisions." },
  { title: "Reward initiative", body: "Beginning is its own victory. Earn credit for starting a focus round, even when the larger quest remains open." },
  { title: "Reduce the party size", body: "When the quest board feels crowded, display only the current quest and its next step." }
];


const ranks = ["Squire", "Adventurer", "Ranger", "Knight", "Hero", "Champion", "Dragon Slayer", "Archmage", "Legend"];


const questTypes = {
  Tiny: { points: 10, label: "Tiny Quest", color: "bg-emerald-100 text-emerald-900 border-emerald-300" },
  Side: { points: 20, label: "Side Quest", color: "bg-sky-100 text-sky-900 border-sky-300" },
  Adventure: { points: 40, label: "Adventure", color: "bg-violet-100 text-violet-900 border-violet-300" },
  Boss: { points: 75, label: "Boss Quest", color: "bg-rose-100 text-rose-900 border-rose-300" }
};


const initialTasks = [
  { id: 1, title: "Open the quest log and choose one mission", type: "Tiny", points: 10, done: false, started: false, steps: [], expanded: true },
  { id: 2, title: "Complete one campfire focus round", type: "Side", points: 20, done: false, started: false, steps: [], expanded: true },
  { id: 3, title: "Leave a trail marker for your future self", type: "Tiny", points: 10, done: false, started: false, steps: [], expanded: true }
];


const instantLoot = [
  {
    id: "tea",
    name: "Tavern Refreshment",
    detail: "Enjoy a favorite drink or snack",
    cost: 15,
    durationMinutes: null
  },
  {
    id: "sweet",
    name: "Sugar Sprite",
    detail: "Claim a small favorite sweet or treat",
    cost: 20,
    durationMinutes: null
  },
  {
    id: "music",
    name: "Bard's Favor",
    detail: "Watch a favorite music video or listen to a favorite song",
    cost: 10,
    durationMinutes: 10
  },
  {
    id: "silly",
    name: "Court Jester's Interlude",
    detail: "Spend a few minutes doing something delightfully pointless",
    cost: 10,
    durationMinutes: 10
  }
];


const restorativeLoot = [
  {
    id: "cozy",
    name: "Cozy Campfire",
    detail: "Get extra cozy and do absolutely nothing for a little while",
    cost: 15,
    durationMinutes: 15
  },
  {
    id: "break",
    name: "Campfire Rest",
    detail: "Take a guilt-free break",
    cost: 25,
    durationMinutes: 15
  },
  {
    id: "outside",
    name: "Forest Interlude",
    detail: "Step outside and enjoy some fresh air",
    cost: 20,
    durationMinutes: 15
  },
  {
    id: "long-break",
    name: "Hero's Respite",
    detail: "Take a guilt-free extended break",
    cost: 45,
    durationMinutes: 30
  },
  {
    id: "nap",
    name: "Enchanted Slumber",
    detail: "Take a short nap or lie down and recharge",
    cost: 50,
    durationMinutes: 30
  },
  {
    id: "book",
    name: "Tome of Leisure",
    detail: "Read purely for pleasure, with no productivity requirements",
    cost: 35,
    durationMinutes: 30
  },
  {
    id: "paint",
    name: "Artist's Interlude",
    detail: "Paint or create purely for fun",
    cost: 40,
    durationMinutes: 45
  },
  {
    id: "craft",
    name: "Workshop Permission",
    detail: "Work on a hobby project with zero productivity requirements",
    cost: 45,
    durationMinutes: 45
  },
  {
    id: "playlist",
    name: "Bard's Private Concert",
    detail: "Enjoy a favorite album from start to finish",
    cost: 50,
    durationMinutes: 60
  }
];


const treasureLoot = [
  {
    id: "youtube",
    name: "Scrying Session",
    detail: "Watch a few favorite videos",
    cost: 30,
    durationMinutes: 20
  },
  {
    id: "game",
    name: "Arcade Portal",
    detail: "Take a gaming break",
    cost: 40,
    durationMinutes: 20
  },
  {
    id: "show",
    name: "Crystal Ball Viewing",
    detail: "Watch one episode of a favorite show",
    cost: 75,
    durationMinutes: 60
  },
  {
    id: "dessert",
    name: "Dragon's Hoard",
    detail: "Get a particularly indulgent favorite dessert",
    cost: 80,
    durationMinutes: null
  },
  {
    id: "takeout",
    name: "Feast of the Victorious",
    detail: "Order or pick up a favorite meal",
    cost: 100,
    durationMinutes: null
  },
  {
    id: "shopping",
    name: "Merchant's Temptation",
    detail: "Spend a small amount on something you've been eyeing",
    cost: 150,
    durationMinutes: null
  },
  {
    id: "treat-yourself",
    name: "Royal Treasury",
    detail: "Buy yourself a guilt-free little luxury",
    cost: 200,
    durationMinutes: null
  },
  {
    id: "movie",
    name: "Grand Theater Quest",
    detail: "Go see a movie you've been wanting to watch",
    cost: 150,
    durationMinutes: 150
  },
  {
    id: "outing",
    name: "Side Quest Unlocked",
    detail: "Go somewhere fun purely because you want to",
    cost: 200,
    durationMinutes: 180
  },
  {
    id: "full-day",
    name: "Day of the Hero",
    detail: "Claim a block of guilt-free leisure for yourself",
    cost: 300,
    durationMinutes: 480
  }
];

const dragonMPrefixes = [
"Mildly",
"Suspiciously",
"Weirdly",
"Deeply",
"Tragically",
"Unreasonably",
"Unexpectedly",
"Aggressively",
"Relentlessly",
"Perpetually",
"Inconveniently",
"Unhelpfully",
"Excessively",
"Remarkably",
"Impressively",
"Alarmingly",
"Disturbingly",
"Unnecessarily",
"Absurdly",
"Dramatically",
"Magnificently",
"Questionably",
"Reluctantly",
"Begrudgingly",
"Determinedly"
];

const dragonAPrefixes = [
"Unreasonable",
"Tedious",
"Inconvenient",
"Overwhelming",
"Reluctant",
"Perpetual",
"Unfinished",
"Unavoidable",
"Distracted",
"Complicated",
"Mundane",
"Daunting",
"Persistent",
"Obstinate",
"Formidable",
"Imposing",
"Bureaucratic",
"Uncooperative",
"Tiresome",
"Perplexing",
"Insufferable",
"Persistent",
"Enormous",
"Questionable",
"Needless"
];

const dragonTitles = [
"Warden of Things That Need Doing",
"Keeper of Whatever This Is",
"Guardian of the Thing You Were Supposed to Do",
"Lord of the Pending Nonsense",
"Master of Today’s Obligations",
"Warden of the Extremely Necessary",
"Keeper of the Things You Keep Putting Off",
"Guardian of the Inconvenient",
"Lord of the Tasks That Could Be Emails",
"Master of the Tiny Obligations",
"Warden of the Minor Annoyances",
"Keeper of the Mundane",
"Guardian of the Tedious",
"Lord of the Administrative Realm",
"Master of the Somehow-Important",
"Warden of the Mildly Urgent",
"Keeper of the Suspiciously Simple",
"Guardian of the Needlessly Complicated",
"Lord of the Several Small Steps",
"Master of the Five-Minute Task",
"Warden of the Brief but Necessary",
"Keeper of the Thing That Shouldn't Take Long",
"Guardian of the Apparently Simple",
"Lord of the “While I'm At It”",
"Master of the “Real Quick”",
"Warden of the “Before I Forget”",
"Keeper of the “Might As Well”",
"Guardian of the “Since I'm Already Here”",
"Lord of the “I'll Do It Later”"
];

const generateDragonName = () => {
  const mPrefix =
    dragonMPrefixes[
      Math.floor(Math.random() * dragonMPrefixes.length)
    ];
	
	const aPrefix =
    dragonAPrefixes[
      Math.floor(Math.random() * dragonAPrefixes.length)
    ];

  const title =
    dragonTitles[
      Math.floor(Math.random() * dragonTitles.length)
    ];

  return `${mPrefix} ${aPrefix} ${title}`;
};

const dragonHpByType = {
  Tiny: 25,
  Side: 50,
  Adventure: 75,
  Boss: 100
};

const unique = items => [...new Set(items.filter(Boolean))];

const pick = items => items[Math.floor(Math.random() * items.length)];

const actionPatterns = [
  {
    words: ["create", "build", "make", "design", "develop", "prepare"],
    steps: title => [
      `Write one sentence describing the finished result for "${title}"`,
      "Gather the minimum source material needed",
      pick([
        "Create a rough outline",
        "Sketch the basic structure",
        "List the three most important parts"
      ]),
      "Create the smallest usable first section",
      "Review the result against the intended outcome",
      "Write the exact next action"
    ]
  },
  {
    words: ["fix", "debug", "troubleshoot", "investigate", "resolve"],
    steps: title => [
      `Write down what is currently happening with "${title}"`,
      "Write down what should happen instead",
      "Reproduce the issue with the smallest safe test",
      "Capture the exact error, output, or unexpected behavior",
      "Change only one variable",
      "Run the test again",
      "Record the result and next hypothesis"
    ]
  },
  {
    words: ["review", "check", "validate", "verify", "audit", "test"],
    steps: title => [
      `Define what a successful review of "${title}" should confirm`,
      "Open the relevant item",
      "Check the highest-risk section first",
      "Record issues without fixing them yet",
      "Resolve or assign each recorded issue",
      "Perform one final validation"
    ]
  },
  {
    words: ["research", "compare", "evaluate", "explore", "learn"],
    steps: title => [
      `Write the specific question "${title}" needs to answer`,
      "Choose no more than three useful sources",
      "Review the first source",
      "Capture only information relevant to the question",
      "Compare the findings",
      "Write a short conclusion and next decision"
    ]
  },
  {
    words: ["clean", "organize", "sort", "declutter"],
    steps: title => [
      `Choose one clearly bounded part of "${title}"`,
      "Gather the tools or containers needed",
      "Remove obvious items first",
      "Group what remains",
      "Put away one group at a time",
      "Stop and identify the next bounded area"
    ]
  },
  {
    words: ["send", "email", "message", "contact", "reply", "respond"],
    steps: title => [
      `Open the correct conversation or compose window for "${title}"`,
      "Write the purpose in one sentence",
      "Add only the details the recipient needs",
      "Add the requested action or question",
      "Review names, dates, and attachments",
      "Send or save the draft"
    ]
  }
];

const objectPatterns = [
  {
    words: ["sql", "database", "query", "table"],
    additions: [
      "Confirm the correct environment and database",
      "Create or identify a safe test case",
      "Run a read-only validation query first",
      "Save the query before making changes",
      "Review affected row counts"
    ]
  },
  {
    words: ["script", "javascript", "code", "api", "webcenter"],
    additions: [
      "Open the relevant editor and source file",
      "Identify the smallest input that demonstrates the behavior",
      "Inspect the current output",
      "Make one isolated change",
      "Run the smallest available test"
    ]
  },
  {
    words: ["demo", "training", "presentation", "slides", "video"],
    additions: [
      "Identify the audience and desired takeaway",
      "List the essential feature or concept to demonstrate",
      "Create the opening and closing first",
      "Prepare one realistic example",
      "Perform a short practice run"
    ]
  },
  {
    words: ["report", "document", "guide", "article"],
    additions: [
      "Identify the audience and purpose",
      "Gather the authoritative source material",
      "Create headings before writing paragraphs",
      "Draft the easiest section first",
      "Check completeness and readability"
    ]
  },
  {
    words: ["meeting", "call", "discussion"],
    additions: [
      "Write the desired outcome",
      "List the decisions or questions needed",
      "Gather supporting material",
      "Prepare a concise agenda",
      "Record follow-up actions afterward"
    ]
  }
];

const fallbackSteps = title => [
  `Describe what "done" means for "${title}"`,
  "Identify the smallest visible starting action",
  "Gather only what is required for that action",
  "Work for one short focus round",
  "Review what changed",
  "Write the exact next action"
];

const makeSteps = (title, questType = "Side") => {
  const normalized = title.toLowerCase().trim();

  const actionMatch = actionPatterns.find(pattern =>
    pattern.words.some(word => normalized.includes(word))
  );

  const objectMatches = objectPatterns.filter(pattern =>
    pattern.words.some(word => normalized.includes(word))
  );

  let steps = actionMatch
    ? actionMatch.steps(title)
    : fallbackSteps(title);

  const objectSteps = objectMatches.flatMap(pattern => pattern.additions);

  /*
    Put context-specific setup near the beginning,
    but keep the first action generated by the action pattern.
  */
  if (objectSteps.length) {
    steps = [
      steps[0],
      ...objectSteps,
      ...steps.slice(1)
    ];
  }

  steps = unique(steps);

  /*
    Keep quests from becoming overwhelming.
    Boss Quests can reveal more detail.
  */
  const limits = {
    Tiny: 3,
    Side: 5,
    Adventure: 7,
    Boss: 9
  };

  return steps.slice(0, limits[questType] || 6);
};


export default function Questline() {
  const [tasks, setTasks] = useState(() => {
	const saved = localStorage.getItem("questline_tasks");
	return saved ? JSON.parse(saved) : initialTasks;
	});
React.useEffect(() => {
	localStorage.setItem(
		"questline_tasks",
	JSON.stringify(tasks)
	);
}, [tasks]);  

  const [title, setTitle] = useState("");
  const [type, setType] = useState("Side");
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(600);
  const [running, setRunning] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [goblinSteps, setGoblinSteps] = useState("");
  const [showGoblinImport, setShowGoblinImport] = useState(false);
  const [xp, setXp] = useState(() => {
		return Number(
			localStorage.getItem("questline_xp")
		) || 0;
	});
	React.useEffect(() => {
	  localStorage.setItem(
		"questline_xp",
		xp
	  );
	}, [xp]);
	const [gold, setGold] = useState(() => {
	  return Number(
		localStorage.getItem("questline_gold")
	  ) || 0;
	});
	React.useEffect(() => {
	  localStorage.setItem(
		"questline_gold",
		gold
	  );
	}, [gold]);
	const [trophies, setTrophies] = useState(() => {
	  return Number(
		localStorage.getItem("questline_trophies")
	  ) || 0;
	});

	React.useEffect(() => {
	  localStorage.setItem(
		"questline_trophies",
		trophies
	  );
	}, [trophies]);
  const [focusRounds, setFocusRounds] = useState(0);
  const [lesson, setLesson] = useState(0);
  const [rewardOpen, setRewardOpen] = useState(null);
  const [toast, setToast] = useState("");
  const timerRef = useRef(null);


React.useEffect(() => {
  const today = new Date()
    .toISOString()
    .split("T")[0];

  const lastLogin =
    localStorage.getItem("questline_last_login");

  if (lastLogin !== today) {
    setGold(g => g + 10);

    announce(
      "Daily Login Reward: +10 Gold!"
    );

    localStorage.setItem(
      "questline_last_login",
      today
    );
  }
}, []);

  const level = Math.floor(xp / 100) + 1;
  const rank = ranks[Math.min(level - 1, ranks.length - 1)];
  const levelProgress = xp % 100;
  const openTasks = useMemo(() => tasks.filter(t => !t.done), [tasks]);
  const selected = tasks.find(t => t.id === selectedId) || null;


  const announce = message => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };


  const playChime = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      [523, 659, 784].forEach((frequency, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + index * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + index * 0.08);
        osc.stop(ctx.currentTime + index * 0.08 + 0.4);
      });
    } catch {}
  };


  React.useEffect(() => {
    if (!running) return undefined;
    timerRef.current = window.setInterval(() => {
      setSeconds(current => {
        if (current <= 1) {
          window.clearInterval(timerRef.current);
          setRunning(false);
          setXp(value => value + 10);
          setGold(value => value + 3);
          setFocusRounds(value => value + 1);
          playChime();
          announce("Campfire round complete: +10 XP and +3 gold!");
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timerRef.current);
  }, [running]);


  const addTask = () => {
    if (!title.trim()) return;
    const config = questTypes[type];
    const task = { id: Date.now(), title: title.trim(), type, points: config.points, done: false, started: false, steps: [], expanded: true };
	if (type === "Boss") {
	  const dragonHp = dragonHpByType[type] || 100;

	  setDragons(current => [
		...current,
		{
		  id: task.id,
		  questId: task.id,
		  questTitle: task.title,
		  dragonName: generateDragonName(),
		  hp: dragonHp,
		  maxHp: dragonHp,
		  defeated: false
		}
	  ]);
	}
    setTasks(current => [...current, task]);
    setSelectedId(task.id);
    setTitle("");
    announce(`${config.label} accepted!`);
  };
  
  const damageDragon = (taskId, damage) => {
  setDragons(current =>
    current.map(dragon => {
      if (dragon.id !== taskId)
        return dragon;

      const newHp = Math.max(
        0,
        dragon.hp - damage
      );
	if (newHp === 0 &&!dragon.defeated) {
		setXp(v => v + 50);
		setGold(v => v + 50);
		setTrophies(v => v + 1);
		
		announce(`🐉 ${dragon.dragonName} defeated! +50 XP +50 Gold`);
		setTimeout(() => {
			setDragons(current =>
			current.filter(d => d.id !== dragon.id)
			);
		}, 2000);
	}

      return {
        ...dragon,
        hp: newHp,
        defeated: newHp === 0
      };
    })
  );
};

  const deleteTask = id => {
    setTasks(current => current.filter(task => task.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const selectTask = id => {
    setSelectedId(id);
    setTasks(current => current.map(task => task.id === id && !task.started ? { ...task, started: true } : task));
    const task = tasks.find(item => item.id === id);
    if (task && !task.started) {
      setXp(value => value + 5);
      announce("Initiative rolled: +5 XP for starting!");
    }
  };


  const completeTask = id => {
    const task = tasks.find(item => item.id === id);
    if (!task || task.done) return;
	const dragon = dragons.find(
		d => d.id === id
		);

		if (dragon) {
		damageDragon(id, 999);
		}
    setTasks(current => current.map(item => item.id === id ? { ...item, done: true, steps: item.steps.map(step => ({ ...step, done: true })) } : item));
    setXp(value => value + task.points);
    setGold(value => value + Math.max(2, Math.round(task.points / 5)));
    if (selectedId === id) setSelectedId(null);
    announce(`Quest complete: +${task.points} XP!`);
  };


  const randomTask = () => {
    if (!openTasks.length) {
      announce("The quest board is clear. Victory!");
      return;
    }
    const chosen = openTasks[Math.floor(Math.random() * openTasks.length)];
    selectTask(chosen.id);
  };

const decomposeTask = (id, force = false) => {
  const task = tasks.find(item => item.id === id);
  if (!task) return;

  if (task.steps.length && !force) {
  setTasks(current =>
    current.map(item =>
      item.id === id
        ? { ...item, expanded: true }
        : item
    )
  );

  announce("This quest already has a revealed path.");
  return;
}

  const steps = makeSteps(task.title, task.type).map(
    (step, index) => ({
      id: `${id}-${Date.now()}-${index}`,
      title: step,
      done: false
    })
  );

  setTasks(current =>
    current.map(item =>
      item.id === id
        ? {
            ...item,
            steps,
            expanded: true,
            type: item.type === "Tiny" ? "Side" : item.type
          }
        : item
    )
  );

  setSelectedId(id);
  announce(force ? "A new route has been revealed!" : "The path has been revealed!");
};

const importGoblinSteps = (taskId) => {
  if (!goblinSteps.trim()) return;

  const steps = goblinSteps
    .split("\n")
    .map((step) =>
      step.replace(/^\d+\.\s*/, "").trim()
    )
    .filter(Boolean)
    .map((step, index) => ({
      id: `${taskId}-goblin-${index}`,
      title: step,
      done: false,
    }));

  setTasks((current) =>
    current.map((task) =>
      task.id === taskId
        ? {
            ...task,
            steps,
            expanded: true,
          }
        : task
    )
  );

  setGoblinSteps("");
  setShowGoblinImport(false);
  announce("🧙 Goblin path imported!");
};
``

  const toggleStep = (taskId, stepId) => {
    setTasks(current => current.map(task => {
      if (task.id !== taskId) return task;
      const steps = task.steps.map(step => step.id === stepId ? { ...step, done: !step.done } : step);
      return { ...task, steps };
    }));
    const task = tasks.find(item => item.id === taskId);
    const step = task?.steps.find(item => item.id === stepId);
    if (step && !step.done) {
      setXp(value => value + 5);
      setGold(value => value + 1);
	  if (dragon) {
		const damageValues = {
		Tiny: 8,
		Side: 12,
		Adventure: 18,
		Boss: 25
		};

		damageDragon(
		taskId,
		damageValues[task?.type] || 10
		);
      announce("Subquest complete: +5 XP and +1 gold!");
    }
  };
  }


  const toggleExpanded = id => {
    setTasks(current => current.map(task => task.id === id ? { ...task, expanded: !task.expanded } : task));
  };


  const resetTimer = value => {
    setRunning(false);
    setMinutes(value);
    setSeconds(value * 60);
  };

  const launchSelected = () => {
    if (!selected) {
      randomTask();
      return;
    }
    if (!selected.started) selectTask(selected.id);
    resetTimer(5);
    setRunning(true);
    announce("Your five-minute launch has begun!");
  };


  const redeemReward = reward => {
    if (gold < reward.cost) {
      announce(`You need ${reward.cost - gold} more gold.`);
      return;
    }
    setGold(value => value - reward.cost);
    setRewardOpen(false);
    announce(`${reward.name} unlocked. Enjoy it guilt-free!`);
  };
  
  const updateStepTitle = (taskId, stepId, newTitle) => {
  setTasks(current =>
    current.map(task => {
      if (task.id !== taskId) return task;

      return {
        ...task,
        steps: task.steps.map(step =>
          step.id === stepId
            ? { ...step, title: newTitle }
            : step
        )
      };
    })
  );
};

const [dragons, setDragons] = useState([]);


  const format = value => `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;


  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#4c1d95_0%,_#1e1b4b_34%,_#0f172a_72%)] text-amber-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-slate-950/65 p-6 shadow-2xl backdrop-blur">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="relative grid gap-5 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-amber-300"><Shield size={20}/><span className="text-sm font-bold uppercase tracking-[0.24em]">Questline Guild Hall</span></div>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">Make starting the victory.</h1>
              <p className="mt-3 max-w-2xl text-slate-300">Accept a quest, reveal its path, and earn experience for every brave first step.</p>
            </div>
            <div className="rounded-2xl border border-amber-400/25 bg-amber-950/45 p-4">
              <div className="flex items-center justify-between"><div><div className="text-xs uppercase tracking-widest text-amber-300">Adventurer Rank</div><div className="mt-1 flex items-center gap-2 text-xl font-bold"><Crown size={20}/>{rank}</div></div><Badge className="border-amber-300 bg-amber-300 text-amber-950">Level {level}</Badge></div>
              <div className="mt-4 flex justify-between text-sm"><span>{xp} XP</span><span>{100 - levelProgress} to next rank</span></div>
              <Progress value={levelProgress} className="mt-2 h-2" />
              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <div className="rounded-xl bg-black/20 p-3"><Coins className="mb-1 text-amber-300" size={18}/><strong>{gold}</strong> gold</div>
                <div className="rounded-xl bg-black/20 p-3"><Flame className="mb-1 text-orange-400" size={18}/><strong>{focusRounds}</strong> rounds</div>
				<div className="rounded-xl bg-black/20 p-3">🏆<strong>{trophies}</strong> trophies</div>
              </div>
            </div>
          </div>
        </header>


        <AnimatePresence>
          {toast && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full border border-amber-300 bg-slate-950 px-5 py-3 text-sm font-semibold text-amber-200 shadow-2xl">{toast}</motion.div>}
        </AnimatePresence>


        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Card className="border-amber-300/40 bg-[#f5e6c8] text-stone-900 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex flex-wrap items-center justify-between gap-3 font-serif text-2xl"><span className="flex items-center gap-2"><ScrollText className="text-amber-800"/>Guild Quest Board</span><Badge variant="outline" className="border-amber-800 text-amber-900">{openTasks.length} open quests</Badge></CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 md:grid-cols-[1fr_auto_auto]">
                  <Input value={title} onChange={event => setTitle(event.target.value)} onKeyDown={event => event.key === "Enter" && addTask()} placeholder="Name your quest..." className="border-amber-800/30 bg-white/60" />
                  <select value={type} onChange={event => setType(event.target.value)} className="rounded-md border border-amber-800/30 bg-white/60 px-3 py-2 text-sm">
                    {Object.entries(questTypes).map(([key, config]) => <option key={key} value={key}>{config.label} · {config.points} XP</option>)}
                  </select>
                  <Button onClick={addTask} className="bg-amber-800 text-amber-50 hover:bg-amber-900"><Plus size={18}/><span className="ml-1">Accept Quest</span></Button>
                </div>


                <div className="grid gap-2 sm:grid-cols-2">
                  <Button onClick={randomTask} className="bg-violet-800 hover:bg-violet-900"><Dices size={18}/><span className="ml-2">Roll for Initiative</span></Button>
                  <Button onClick={launchSelected} className="bg-rose-800 hover:bg-rose-900"><WandSparkles size={18}/><span className="ml-2">I Don't Know What to Do</span></Button>
                </div>


                <AnimatePresence>
                  {selected && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-2xl border-2 border-violet-500 bg-violet-100 p-4 text-violet-950">
                      <div className="text-xs font-black uppercase tracking-widest text-violet-700">Active Quest</div>
                      <div className="mt-1 text-xl font-bold">{selected.title}</div>
                      {selected.steps.length > 0 && <div className="mt-2 flex items-center gap-2 text-sm"><Footprints size={16}/><span>Next step: {selected.steps.find(step => !step.done)?.title || "Claim your victory"}</span></div>}
                      <div className="mt-4 flex flex-wrap gap-2">
						<Button onClick={launchSelected} size="sm">
							<Play size={16}/>
							<span className="ml-1">Start 5-minute launch</span>
						</Button>

						<Button
						onClick={() => decomposeTask(selected.id)}
						size="sm"
						variant="outline"
						>⚔️ Reveal smaller steps
						</Button>

						{selected.steps.length > 0 && (
						<Button
						onClick={() => decomposeTask(selected.id, true)}
						size="sm"
						variant="outline"
						>🎲 Reroll quest path
						</Button>
						)}
						
						<Button
						  size="sm"
						  variant="outline"
						  onClick={() => {setShowGoblinImport(true);
							window.open(
							  `https://goblin.tools/ToDo?task=${encodeURIComponent(selected.title)}`,
							  "_blank"
							);
						  }}
						>🔮 Magic Breakdown
						</Button>
						
						{showGoblinImport && (
							<div className="w-full mt-2">
								<Textarea
								  value={goblinSteps}
								  onChange={(e) => setGoblinSteps(e.target.value)}
								  placeholder="Paste Goblin output here..."
								  className="w-full rounded-md border border-amber-800/30 bg-white/60 p-2 text-sm text-stone-900"
								/>

								<Button
								  className="mt-2"
								  size="sm"
								  variant="outline"
								  onClick={() => importGoblinSteps(selected.id)}
								>Import Goblin Steps
								</Button>
							</div>
						)}
						<Button
						onClick={() => completeTask(selected.id)}
						size="sm"
						variant="outline"
						>
							Complete quest
						</Button>
					</div>

                    </motion.div>
                  )}
                </AnimatePresence>


                <div className="space-y-3">
                  {tasks.map(task => {
                    const completedSteps = task.steps.filter(step => step.done).length;
					const completed = task.steps.filter(step => step.done);
					const upcoming = task.steps.filter(step => !step.done).slice(0, completed.length + 3);
					const visibleSteps = [...completed,...upcoming];
                    const stepPercent = task.steps.length ? (completedSteps / task.steps.length) * 100 : 0;
                    return (
                      <motion.div layout key={task.id} className={`rounded-2xl border p-4 ${task.done ? "border-emerald-400 bg-emerald-50" : selectedId === task.id ? "border-violet-500 bg-white" : "border-amber-800/20 bg-white/60"}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <button onClick={() => completeTask(task.id)} className={task.done ? "text-emerald-600" : "mt-0.5 text-stone-400 hover:text-emerald-600"}><CheckCircle2/></button>
                            <div className="min-w-0">
                              <div className={task.done ? "line-through text-stone-500" : "font-semibold"}>{task.title}</div>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                                <span className={`rounded-full border px-2 py-0.5 ${questTypes[task.type].color}`}>{questTypes[task.type].label}</span>
                                <span className="text-stone-500">{task.points} XP</span>
                                {task.started && <span className="font-semibold text-violet-700">Initiative rolled</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex shrink-0 gap-1">
                            {!task.done && <Button size="sm" variant="ghost" onClick={() => selectTask(task.id)}>Choose</Button>}
                            {!task.done && <Button size="icon" variant="ghost" onClick={() => decomposeTask(task.id)} title="Break into smaller steps"><Swords size={17}/></Button>}
                            <Button size="icon" variant="ghost" onClick={() => deleteTask(task.id)} title="Delete quest"><Trash2 size={16}/></Button>
                          </div>
                        </div>


                        {task.steps.length > 0 && (
                          <div className="mt-4 pl-9">
                            <button onClick={() => toggleExpanded(task.id)} className="flex w-full items-center justify-between text-sm font-semibold text-amber-900">
                              <span>Quest path · {completedSteps}/{task.steps.length} subquests</span>
							  {task.expanded ? <ChevronDown size={17}/> : <ChevronRight size={17}/>} 
							  </button>
                            <Progress value={stepPercent} className="mt-2 h-2" />
                            <AnimatePresence initial={false}>
                              {task.expanded && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 space-y-2 overflow-hidden">
                                  {visibleSteps.map((step, index) => (
                                    <button key={step.id} onClick={() => toggleStep(task.id, step.id)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition ${step.done ? "border-emerald-200 bg-emerald-50 text-stone-500" : "border-amber-800/15 bg-amber-50 hover:border-violet-400"}`}>
                                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${step.done ? "bg-emerald-600 text-white" : "bg-amber-800 text-amber-50"}`}>{step.done ? "✓" : index + 1}</span>
                                      <Input value={step.title} onClick={event => event.stopPropagation()} onChange={event => updateStepTitle( task.id, step.id, event.target.value)} className={`border-0 bg-transparent p-0 shadow-none ${step.done ? "line-through" : ""}`}/>
                                      {!step.done && <span className="ml-auto text-xs text-amber-800">+5 XP</span>}
                                    </button>
                                  ))}
								  {task.steps.length > visibleSteps.length && (
									<div className="text-center text-xs text-stone-500 mt-2">{task.steps.length - visibleSteps.length} more steps will be revealed as you progress... </div>)}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>


          <div className="space-y-6">
            <Card className="border-orange-400/30 bg-slate-950/75 text-white shadow-2xl">
              <CardHeader><CardTitle className="flex items-center gap-2 font-serif"><Volume2 className="text-orange-300"/>Campfire Focus</CardTitle></CardHeader>
              <CardContent className="text-center">
                <div className="rounded-2xl border border-orange-400/20 bg-orange-950/40 py-5">
                  <Flame className={`mx-auto mb-2 text-orange-400 ${running ? "animate-pulse" : ""}`} size={30}/>
                  <div className="font-mono text-6xl font-black tracking-tight">{format(seconds)}</div>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-2">{[5, 10, 15, 25].map(value => <Button key={value} size="sm" variant={minutes === value ? "default" : "secondary"} onClick={() => resetTimer(value)}>{value}m</Button>)}</div>
                <div className="mt-3 flex justify-center gap-2">
                  <Button onClick={() => setRunning(!running)} disabled={seconds === 0}>{running ? <Pause/> : <Play/>}<span className="ml-2">{running ? "Pause" : "Begin"}</span></Button>
                  <Button variant="secondary" onClick={() => resetTimer(minutes)}><RotateCcw/></Button>
                </div>
                <p className="mt-3 text-xs text-slate-400">Complete a round to earn 10 XP and 3 gold. A gentle victory chime sounds at the end.</p>
              </CardContent>
            </Card>

			<Card className="border-red-500/40
							bg-slate-950/75
							text-red-100"
				>
				<CardHeader>
					<CardTitle>
					🐉 Active Dragons
					</CardTitle>
				</CardHeader>

				<CardContent>
					{dragons.length === 0 && (
					<p>
						No dragons currently threaten
						the kingdom.
					</p>
					)}

					{dragons.map(dragon => (
					<div
						key={dragon.id}
						className="mb-4"
					>
						<div className="flex justify-between">
						<span>
							<div className="font-bold text-red-300">
							🐉 {dragon.dragonName}
							</div>

							<div className="text-xs text-slate-400">
							Threatening:
							{dragon.questTitle}
							</div>
						</span>

						<span>
							{dragon.hp}/
							{dragon.maxHp}
						</span>
						</div>

						<Progress
						value={
							(dragon.hp /
							dragon.maxHp) * 100
						}
						className="mt-2"
						/>

						{dragon.defeated && (
						<div className="mt-2 text-green-400 font-bold">
							🏆 Dragon Defeated!
						</div>
						)}
					</div>
					))}
				</CardContent>
			</Card>

			<Card className="border-amber-300/40 bg-[#f5e6c8] text-stone-900">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 font-serif">
				<Gift className="text-amber-800" />
				Reward Chests
				</CardTitle>
			</CardHeader>

			<CardContent>
				<p className="text-sm text-stone-600">
				Spend earned gold on a real-world reward you choose in advance.
				</p>
				<div className="mt-4 mb-3 flex items-center justify-between rounded-xl bg-amber-900/10 px-4 py-2">
			<span className="text-sm font-medium text-stone-600">
				Your earned gold
			</span>
			<span className="flex items-center gap-1 font-bold text-amber-800">
				<Coins size={16} />
				{gold}g
			</span>
			</div>
				<div className="mt-4 grid gap-3 sm:grid-cols-3">

				{/* Instant Loot */}
				<Button
					className="h-auto min-h-24 flex-col gap-1 bg-amber-700 hover:bg-amber-800"
					onClick={() => setRewardOpen(rewardOpen === "instant" ? null : "instant")}
				>
					<Coins size={20} />
					<span className="font-Bold">Treats</span>
					<span className="text-xs font-normal opacity-80">
					10–25g
					</span>
				</Button>

				{/* Restorative */}
				<Button
					className="h-auto min-h-24 flex-col gap-1 bg-emerald-700 hover:bg-emerald-800"
					onClick={() => setRewardOpen(rewardOpen === "restorative" ? null : "restorative")}
				>
					<Heart size={20} />
					<span className="font-Bold">Recharge</span>
					<span className="text-xs font-normal opacity-80">
					20–50g
					</span>
				</Button>

				{/* Treasure */}
				<Button
					className="h-auto min-h-24 flex-col gap-1 bg-purple-800 hover:bg-purple-900"
					onClick={() => setRewardOpen(rewardOpen === "treasure" ? null : "treasure")}
				>
				<Gem size={20} />
					<span className="font-bold">Treasure</span>
					<span className="text-xs font-normal opacity-80">
					50g+
					</span>
				</Button>

				</div>

				<AnimatePresence mode="wait">
				{rewardOpen && (
					<motion.div
					key={rewardOpen}
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					exit={{ opacity: 0, height: 0 }}
					className="mt-4 space-y-2 overflow-hidden"
					>
					{(
						rewardOpen === "instant"
						? instantLoot
						: rewardOpen === "restorative"
							? restorativeLoot
							: treasureLoot
					).map(reward => (
						<button
						key={reward.id}
						onClick={() => redeemReward(reward)}
						className="w-full rounded-xl border border-amber-800/20 bg-white/60 p-3 text-left hover:border-amber-700"
						>
						<div className="flex justify-between gap-2 font-semibold">
							<span>{reward.name}</span>
							<span className="text-amber-800">
							{reward.cost}g
							</span>
						</div>
	
						<div className="text-xs text-stone-500">
							{reward.detail}
						</div>
						
						{reward.durationMinutes != null && (
						<div className="mt-2 flex items-center gap-3 text-xs text-stone-400">
							<span>⏱️ {reward.durationMinutes} min</span>
						</div>
						)}

						</button>
					))}
					</motion.div>
				)}
				</AnimatePresence>
			</CardContent>
			</Card>
			
            <Card className="border-amber-300/40 bg-[#f5e6c8] text-stone-900">
              <CardHeader><CardTitle className="flex items-center gap-2 font-serif"><BookOpen className="text-amber-800"/>Adventurer Training</CardTitle></CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{lessons[lesson].title}</div>
                <p className="mt-2 text-sm text-stone-600">{lessons[lesson].body}</p>
                <Button className="mt-4 w-full" variant="outline" onClick={() => setLesson((lesson + 1) % lessons.length)}>Turn the page</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">Questline supports task initiation and self-organization. It is not medical care or a substitute for guidance from a qualified clinician.</div>      </div>
    </div>
  );
}

