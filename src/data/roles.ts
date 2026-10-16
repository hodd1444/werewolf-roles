import type { IconKey } from '../components/RoleIcon';

export type Lang = 'de' | 'en';
export type L = { de: string; en: string };
export type Team = 'village' | 'wolves' | 'solo' | 'ambiguous';
export type NightWhen = 'first' | 'every' | 'everyOther' | 'notFirst';
export type NightSpecial = 'silence' | 'lovers' | 'thief' | 'host';

export interface NightAction {
  order: number;
  when: NightWhen;
  text: L | string;
  special?: NightSpecial;
}

export interface RoleDef {
  id: string;
  name: L | string;
  desc: L | string;
  team: Team;
  icon: IconKey;
  color: string;
  base?: boolean;
  night?: NightAction;
  /** Wakes up together with the werewolves */
  wakesWithWolves?: boolean;
  custom?: boolean;
}

export const tr = (v: L | string, lang: Lang) => (typeof v === 'string' ? v : v[lang]);

export const BUILTIN_ROLES: RoleDef[] = [
  // ───────────── Basisspiel ─────────────
  {
    id: 'werewolf',
    base: true,
    team: 'wolves',
    icon: 'wolf',
    color: '#8e1b14',
    wakesWithWolves: true,
    name: { de: 'Werwolf', en: 'Werewolf' },
    desc: {
      de: 'Erwacht jede Nacht mit den anderen Werwölfen und wählt gemeinsam ein Opfer. Tagsüber gibt er sich als harmloser Dorfbewohner aus. Die Werwölfe gewinnen, wenn alle Dorfbewohner tot sind.',
      en: 'Wakes up every night with the other werewolves and they choose a victim together. During the day they pretend to be harmless villagers. The werewolves win when all villagers are dead.',
    },
    night: {
      order: 40,
      when: 'every',
      text: {
        de: 'Die Werwölfe erwachen, erkennen einander und einigen sich lautlos auf ein Opfer.',
        en: 'The werewolves wake up, recognise each other and silently agree on a victim.',
      },
    },
  },
  {
    id: 'villager',
    base: true,
    team: 'village',
    icon: 'villager',
    color: '#c9a24a',
    name: { de: 'Dorfbewohner', en: 'Villager' },
    desc: {
      de: 'Hat keine Sonderfähigkeit. Seine einzige Waffe ist seine Stimme bei der Dorfversammlung, sein Gespür für Lügen und seine Überzeugungskraft.',
      en: 'Has no special ability. Their only weapons are their vote at the village meeting, their nose for lies and their powers of persuasion.',
    },
  },
  {
    id: 'seer',
    base: true,
    team: 'village',
    icon: 'seer',
    color: '#6b3fa0',
    name: { de: 'Seherin', en: 'Seer' },
    desc: {
      de: 'Darf jede Nacht die wahre Identität eines Spielers sehen. Sie muss den Dorfbewohnern helfen, ohne sich selbst zu verraten.',
      en: 'May look at the true identity of one player every night. She must help the villagers without giving herself away.',
    },
    night: {
      order: 30,
      when: 'every',
      text: {
        de: 'Die Seherin erwacht und zeigt auf einen Spieler. Zeige ihr dessen Rollenkarte.',
        en: 'The seer wakes up and points at a player. Show her that player’s role card.',
      },
    },
  },
  {
    id: 'witch',
    base: true,
    team: 'village',
    icon: 'witch',
    color: '#2f7a5a',
    name: { de: 'Hexe', en: 'Witch' },
    desc: {
      de: 'Besitzt einen Heiltrank und einen Gifttrank, die sie je einmal im Spiel einsetzen darf: Der Heiltrank rettet das Opfer der Werwölfe, der Gifttrank tötet einen Spieler ihrer Wahl.',
      en: 'Owns one healing potion and one poison potion, each usable once per game: the healing potion saves the werewolves’ victim, the poison kills a player of her choice.',
    },
    night: {
      order: 60,
      when: 'every',
      text: {
        de: 'Die Hexe erwacht. Zeige ihr das Opfer der Werwölfe. Will sie ihren Heiltrank nutzen? Will sie ihren Gifttrank auf jemanden anwenden?',
        en: 'The witch wakes up. Show her the werewolves’ victim. Does she want to use her healing potion? Does she want to use her poison on someone?',
      },
    },
  },
  {
    id: 'hunter',
    base: true,
    team: 'village',
    icon: 'hunter',
    color: '#9a5a22',
    name: { de: 'Jäger', en: 'Hunter' },
    desc: {
      de: 'Wenn der Jäger stirbt – egal wie – reißt er mit seinem letzten Atemzug einen anderen Spieler seiner Wahl mit in den Tod.',
      en: 'When the hunter dies – no matter how – he takes another player of his choice down with him with his last breath.',
    },
  },
  {
    id: 'cupid',
    base: true,
    team: 'village',
    icon: 'cupid',
    color: '#c2456b',
    name: { de: 'Amor', en: 'Cupid' },
    desc: {
      de: 'Bestimmt in der ersten Nacht zwei Verliebte. Stirbt einer von ihnen, stirbt der andere vor Kummer. Sind ein Werwolf und ein Dorfbewohner verliebt, gewinnen sie nur, wenn alle anderen sterben.',
      en: 'Chooses two lovers on the first night. If one of them dies, the other dies of grief. If a werewolf and a villager fall in love, they only win if everyone else dies.',
    },
    night: {
      order: 10,
      when: 'first',
      special: 'lovers',
      text: {
        de: 'Amor erwacht und zeigt auf zwei Spieler, die sich unsterblich verlieben. Danach schläft Amor ein – tippe die Verliebten an, sie erwachen kurz und erkennen einander.',
        en: 'Cupid wakes up and points at two players who fall madly in love. Cupid goes back to sleep – tap the lovers, they wake briefly and recognise each other.',
      },
    },
  },
  {
    id: 'littleGirl',
    base: true,
    team: 'village',
    icon: 'littleGirl',
    color: '#d07a3a',
    name: { de: 'Kleines Mädchen', en: 'Little Girl' },
    desc: {
      de: 'Darf nachts blinzeln, während die Werwölfe wach sind, um sie zu entlarven. Wird sie dabei erwischt, kann sie sofort statt des eigentlichen Opfers sterben.',
      en: 'May peek at night while the werewolves are awake to unmask them. If she is caught, she may die instantly instead of the intended victim.',
    },
  },
  {
    id: 'thief',
    base: true,
    team: 'village',
    icon: 'thief',
    color: '#3d4f7a',
    name: { de: 'Dieb', en: 'Thief' },
    desc: {
      de: 'Ist der Dieb im Spiel, werden zwei Karten mehr verteilt als Spieler mitspielen. In der ersten Nacht darf der Dieb seine Karte gegen eine der beiden übrigen tauschen. Sind beide Werwölfe, muss er tauschen.',
      en: 'If the thief is in the game, two more cards are dealt than there are players. On the first night the thief may swap his card for one of the two leftover cards. If both are werewolves, he must swap.',
    },
    night: {
      order: 5,
      when: 'first',
      special: 'thief',
      text: {
        de: 'Der Dieb erwacht. Zeige ihm die beiden übrigen Karten. Er darf eine davon nehmen – tippe sie an, um zu tauschen.',
        en: 'The thief wakes up. Show him the two leftover cards. He may take one of them – tap it to swap.',
      },
    },
  },

  {
    id: 'casanova',
    base: true,
    team: 'village',
    icon: 'casanova',
    color: '#9c2f5a',
    name: { de: 'Casanova', en: 'Casanova' },
    desc: {
      de: 'Schläft jede Nacht bei jemand anderem. Greifen die Werwölfe die Casanova an, ist sie nicht zu Hause und überlebt. Stirbt aber die Person, bei der sie gerade schläft, stirbt sie mit.',
      en: 'Sleeps at someone else’s house every night. If the werewolves attack Casanova, she isn’t home and survives. But if the person she is sleeping with dies, she dies too.',
    },
    night: {
      order: 25,
      when: 'every',
      special: 'host',
      text: {
        de: 'Die Casanova erwacht und zeigt auf die Person, bei der sie heute Nacht schläft (nicht dieselbe wie letzte Nacht).',
        en: 'Casanova wakes up and points at the person she sleeps with tonight (not the same as last night).',
      },
    },
  },

  // ───────────── Erweiterungen & Community ─────────────
  {
    id: 'silencer',
    team: 'village',
    icon: 'silencer',
    color: '#4a4a5c',
    name: { de: 'Der Silencer', en: 'The Silencer' },
    desc: {
      de: 'Wählt jede Nacht eine Person aus, die bei der nächsten Dorfversammlung nicht sprechen darf. Abstimmen darf sie trotzdem.',
      en: 'Chooses one person every night who is not allowed to speak at the next village meeting. They may still vote.',
    },
    night: {
      order: 62,
      when: 'every',
      special: 'silence',
      text: {
        de: 'Der Silencer erwacht und zeigt auf eine Person, die morgen bei der Dorfversammlung schweigen muss.',
        en: 'The Silencer wakes up and points at a person who must stay silent at tomorrow’s village meeting.',
      },
    },
  },
  {
    id: 'guard',
    team: 'village',
    icon: 'guard',
    color: '#3f6f8f',
    name: { de: 'Heiler / Beschützer', en: 'Bodyguard' },
    desc: {
      de: 'Wählt jede Nacht einen Spieler, der in dieser Nacht nicht von den Werwölfen getötet werden kann. Er darf nicht zweimal hintereinander dieselbe Person schützen, sich selbst aber schon.',
      en: 'Chooses one player every night who cannot be killed by the werewolves that night. May not protect the same person two nights in a row, but may protect themself.',
    },
    night: {
      order: 20,
      when: 'every',
      text: {
        de: 'Der Beschützer erwacht und zeigt auf die Person, die er heute Nacht beschützen möchte (nicht dieselbe wie letzte Nacht).',
        en: 'The bodyguard wakes up and points at the person they want to protect tonight (not the same as last night).',
      },
    },
  },
  {
    id: 'elder',
    team: 'village',
    icon: 'elder',
    color: '#7a6a4a',
    name: { de: 'Der Alte', en: 'Elder' },
    desc: {
      de: 'Überlebt den ersten Angriff der Werwölfe. Wird er jedoch vom Dorf hingerichtet, verlieren alle Dorfbewohner mit Sonderrollen vor Kummer ihre Fähigkeiten.',
      en: 'Survives the first werewolf attack. But if the village executes him, all villagers with special roles lose their powers out of shame.',
    },
  },
  {
    id: 'scapegoat',
    team: 'village',
    icon: 'scapegoat',
    color: '#8a7350',
    name: { de: 'Sündenbock', en: 'Scapegoat' },
    desc: {
      de: 'Endet eine Abstimmung unentschieden, stirbt der Sündenbock. Dafür bestimmt er, wer bei der nächsten Abstimmung mitstimmen darf.',
      en: 'If a vote ends in a tie, the scapegoat dies. In return they decide who may vote in the next vote.',
    },
  },
  {
    id: 'villageIdiot',
    team: 'village',
    icon: 'idiot',
    color: '#c38a2c',
    name: { de: 'Dorfdepp', en: 'Village Idiot' },
    desc: {
      de: 'Wird der Dorfdepp vom Dorf zum Tode verurteilt, deckt er seine Karte auf und wird verschont. Ab dann darf er jedoch nicht mehr abstimmen.',
      en: 'If the village votes to execute the idiot, he reveals his card and is spared. From then on, however, he may no longer vote.',
    },
  },
  {
    id: 'knight',
    team: 'village',
    icon: 'knight',
    color: '#5b6470',
    name: { de: 'Ritter mit der rostigen Klinge', en: 'Knight with the Rusty Sword' },
    desc: {
      de: 'Wird der Ritter von den Werwölfen getötet, infiziert er mit seiner rostigen Klinge den Werwolf zu seiner Linken – dieser stirbt in der folgenden Nacht.',
      en: 'If the knight is killed by the werewolves, his rusty sword infects the first werewolf to his left – that werewolf dies the following night.',
    },
  },
  {
    id: 'fox',
    team: 'village',
    icon: 'fox',
    color: '#c0602a',
    name: { de: 'Fuchs', en: 'Fox' },
    desc: {
      de: 'Zeigt nachts auf einen Spieler. Ist dieser oder einer seiner beiden Nachbarn ein Werwolf, nickt der Spielleiter. Ist keiner der drei ein Werwolf, verliert der Fuchs seine Gabe.',
      en: 'Points at a player at night. If that player or one of their two neighbours is a werewolf, the moderator nods. If none of the three is a werewolf, the fox loses its power.',
    },
    night: {
      order: 32,
      when: 'every',
      text: {
        de: 'Der Fuchs erwacht und zeigt auf einen Spieler. Nicke, wenn dieser oder einer seiner Nachbarn ein Werwolf ist.',
        en: 'The fox wakes up and points at a player. Nod if that player or one of their neighbours is a werewolf.',
      },
    },
  },
  {
    id: 'bearTamer',
    team: 'village',
    icon: 'bear',
    color: '#6e4a2e',
    name: { de: 'Bärenführer', en: 'Bear Tamer' },
    desc: {
      de: 'Sitzt morgens mindestens ein Werwolf direkt neben dem Bärenführer, brummt der Spielleiter laut wie ein Bär.',
      en: 'If at least one werewolf sits directly next to the bear tamer in the morning, the moderator growls loudly like a bear.',
    },
  },
  {
    id: 'twoSisters',
    team: 'village',
    icon: 'sisters',
    color: '#b05a8a',
    name: { de: 'Schwester', en: 'Sister' },
    desc: {
      de: 'Kommt zu zweit ins Spiel. Die beiden Schwestern erwachen in der ersten Nacht und erkennen einander – sie wissen also, wem sie vertrauen können.',
      en: 'Comes in pairs. The two sisters wake up on the first night and recognise each other – so they know whom they can trust.',
    },
    night: {
      order: 14,
      when: 'first',
      text: {
        de: 'Die Schwestern erwachen und erkennen einander.',
        en: 'The sisters wake up and recognise each other.',
      },
    },
  },
  {
    id: 'threeBrothers',
    team: 'village',
    icon: 'brothers',
    color: '#4f6e3a',
    name: { de: 'Bruder', en: 'Brother' },
    desc: {
      de: 'Kommt zu dritt ins Spiel. Die drei Brüder erwachen in der ersten Nacht und erkennen einander.',
      en: 'Comes in threes. The three brothers wake up on the first night and recognise each other.',
    },
    night: {
      order: 15,
      when: 'first',
      text: {
        de: 'Die Brüder erwachen und erkennen einander.',
        en: 'The brothers wake up and recognise each other.',
      },
    },
  },
  {
    id: 'stutteringJudge',
    team: 'village',
    icon: 'judge',
    color: '#5a3a2a',
    name: { de: 'Stotternder Richter', en: 'Stuttering Judge' },
    desc: {
      de: 'Vereinbart in der ersten Nacht ein geheimes Zeichen mit dem Spielleiter. Gibt er es einmal im Spiel während einer Abstimmung, findet direkt danach eine zweite Abstimmung statt.',
      en: 'Agrees on a secret sign with the moderator on the first night. If he gives it once per game during a vote, a second vote takes place immediately afterwards.',
    },
    night: {
      order: 16,
      when: 'first',
      text: {
        de: 'Der stotternde Richter erwacht und vereinbart mit dir ein geheimes Zeichen.',
        en: 'The stuttering judge wakes up and agrees on a secret sign with you.',
      },
    },
  },
  {
    id: 'devotedServant',
    team: 'village',
    icon: 'servant',
    color: '#8a5a6a',
    name: { de: 'Ergebene Magd', en: 'Devoted Servant' },
    desc: {
      de: 'Bevor die Karte eines hingerichteten Spielers aufgedeckt wird, darf sich die Magd zu erkennen geben und dessen Rolle übernehmen.',
      en: 'Before the card of an executed player is revealed, the servant may reveal herself and take over that player’s role.',
    },
  },
  {
    id: 'actor',
    team: 'village',
    icon: 'actor',
    color: '#a0446a',
    name: { de: 'Schauspieler', en: 'Actor' },
    desc: {
      de: 'Vor dem Spiel werden drei Sonderrollen offen ausgelegt. Jede Nacht darf der Schauspieler eine davon wählen und deren Fähigkeit bis zur nächsten Nacht nutzen.',
      en: 'Before the game, three special roles are laid out face up. Every night the actor may pick one of them and use its power until the next night.',
    },
    night: {
      order: 7,
      when: 'every',
      text: {
        de: 'Der Schauspieler erwacht und wählt eine der ausliegenden Rollen, deren Fähigkeit er diese Nacht nutzt.',
        en: 'The actor wakes up and picks one of the displayed roles to use its power tonight.',
      },
    },
  },
  {
    id: 'raven',
    team: 'village',
    icon: 'raven',
    color: '#2c2f3a',
    name: { de: 'Rabe', en: 'Raven' },
    desc: {
      de: 'Markiert jede Nacht einen Spieler. Dieser erhält bei der nächsten Abstimmung zwei zusätzliche Stimmen gegen sich.',
      en: 'Marks one player every night. That player receives two extra votes against them in the next vote.',
    },
    night: {
      order: 70,
      when: 'every',
      text: {
        de: 'Der Rabe erwacht und zeigt auf einen Spieler, der morgen zwei Stimmen extra gegen sich bekommt.',
        en: 'The raven wakes up and points at a player who will get two extra votes against them tomorrow.',
      },
    },
  },
  {
    id: 'prince',
    team: 'village',
    icon: 'prince',
    color: '#b8902e',
    name: { de: 'Prinz', en: 'Prince' },
    desc: {
      de: 'Wird der Prinz vom Dorf verurteilt, deckt er seine Karte auf und überlebt. Diese Gnade erhält er nur ein einziges Mal.',
      en: 'If the prince is voted out by the village, he reveals his card and survives. He is granted this mercy only once.',
    },
  },
  {
    id: 'lycan',
    team: 'village',
    icon: 'lycan',
    color: '#4c3d6e',
    name: { de: 'Lykanthrop', en: 'Lycan' },
    desc: {
      de: 'Ein ganz normaler Dorfbewohner – doch die Seherin sieht ihn fälschlicherweise als Werwolf.',
      en: 'An ordinary villager – but the seer wrongly sees them as a werewolf.',
    },
  },
  {
    id: 'cursed',
    team: 'ambiguous',
    icon: 'cursed',
    color: '#4a2a3e',
    name: { de: 'Verfluchter', en: 'Cursed' },
    desc: {
      de: 'Beginnt als Dorfbewohner. Wird er von den Werwölfen angegriffen, stirbt er nicht, sondern wird selbst zum Werwolf.',
      en: 'Starts as a villager. If attacked by the werewolves, they don’t die but become a werewolf themself.',
    },
  },
  {
    id: 'wildChild',
    team: 'ambiguous',
    icon: 'wildChild',
    color: '#5e7a2e',
    name: { de: 'Wildes Kind', en: 'Wild Child' },
    desc: {
      de: 'Wählt in der ersten Nacht ein Vorbild. Solange dieses lebt, ist das wilde Kind ein Dorfbewohner. Stirbt das Vorbild, wird es zum Werwolf.',
      en: 'Chooses a role model on the first night. As long as the model lives, the wild child is a villager. If the model dies, it becomes a werewolf.',
    },
    night: {
      order: 12,
      when: 'first',
      text: {
        de: 'Das wilde Kind erwacht und zeigt auf sein Vorbild. Merke dir, wer es ist.',
        en: 'The wild child wakes up and points at its role model. Remember who it is.',
      },
    },
  },
  {
    id: 'wolfHound',
    team: 'ambiguous',
    icon: 'wolfHound',
    color: '#6a4e3a',
    name: { de: 'Wolfshund', en: 'Wolf Hound' },
    desc: {
      de: 'Entscheidet sich in der ersten Nacht, ob er ein Dorfbewohner oder ein Werwolf sein will. Die Wahl gilt für das ganze Spiel.',
      en: 'Decides on the first night whether to be a villager or a werewolf. The choice holds for the whole game.',
    },
    night: {
      order: 11,
      when: 'first',
      text: {
        de: 'Der Wolfshund erwacht und zeigt an, ob er Dorfbewohner oder Werwolf sein will. Als Werwolf erwacht er ab jetzt mit dem Rudel.',
        en: 'The wolf hound wakes up and signals whether it wants to be a villager or a werewolf. As a werewolf it now wakes with the pack.',
      },
    },
  },
  {
    id: 'doppelganger',
    team: 'ambiguous',
    icon: 'doppelganger',
    color: '#3a6a6a',
    name: { de: 'Doppelgänger', en: 'Doppelgänger' },
    desc: {
      de: 'Wählt in der ersten Nacht einen Spieler. Stirbt dieser, übernimmt der Doppelgänger heimlich dessen Rolle und Team.',
      en: 'Chooses a player on the first night. If that player dies, the doppelgänger secretly takes over their role and team.',
    },
    night: {
      order: 9,
      when: 'first',
      text: {
        de: 'Der Doppelgänger erwacht und zeigt auf den Spieler, dessen Rolle er beim Tod übernimmt.',
        en: 'The doppelgänger wakes up and points at the player whose role they will take on that player’s death.',
      },
    },
  },
  {
    id: 'bigBadWolf',
    team: 'wolves',
    icon: 'bigBadWolf',
    color: '#5a0f0b',
    wakesWithWolves: true,
    name: { de: 'Großer böser Wolf', en: 'Big Bad Wolf' },
    desc: {
      de: 'Frisst mit den Werwölfen und erwacht danach erneut, um allein ein zweites Opfer zu wählen – solange noch kein Werwolf (oder Wildes Kind/Wolfshund) gestorben ist.',
      en: 'Feeds with the werewolves and then wakes again to choose a second victim alone – as long as no werewolf (or wild child/wolf hound) has died yet.',
    },
    night: {
      order: 45,
      when: 'every',
      text: {
        de: 'Der große böse Wolf erwacht erneut und wählt ein zweites Opfer – nur, solange noch kein Werwolf gestorben ist.',
        en: 'The big bad wolf wakes again and chooses a second victim – only while no werewolf has died yet.',
      },
    },
  },
  {
    id: 'accursedWolfFather',
    team: 'wolves',
    icon: 'wolfFather',
    color: '#6a1030',
    wakesWithWolves: true,
    name: { de: 'Urwolf', en: 'Accursed Wolf-Father' },
    desc: {
      de: 'Ein Werwolf, der einmal im Spiel das Opfer der Werwölfe infizieren kann, statt es zu töten. Das Opfer wird heimlich zum Werwolf, behält aber seine Fähigkeit.',
      en: 'A werewolf who, once per game, may infect the werewolves’ victim instead of killing them. The victim secretly becomes a werewolf but keeps their power.',
    },
    night: {
      order: 42,
      when: 'every',
      text: {
        de: 'Der Urwolf zeigt an, ob er das Opfer infizieren möchte (einmal pro Spiel). Tippe das Opfer ggf. an – es ist nun Werwolf.',
        en: 'The wolf-father signals whether he wants to infect the victim (once per game). If so, tap the victim – they are now a werewolf.',
      },
    },
  },
  {
    id: 'wolfSeer',
    team: 'wolves',
    icon: 'wolfSeer',
    color: '#4a1a5a',
    wakesWithWolves: true,
    name: { de: 'Wolfsseherin', en: 'Wolf Seer' },
    desc: {
      de: 'Gehört zu den Werwölfen. Darf jede Nacht die Rolle eines Spielers ansehen, um dem Rudel bei der Jagd nach Seherin & Co. zu helfen.',
      en: 'Belongs to the werewolves. May look at one player’s role every night to help the pack hunt the seer & co.',
    },
    night: {
      order: 35,
      when: 'every',
      text: {
        de: 'Die Wolfsseherin erwacht und zeigt auf einen Spieler. Zeige ihr dessen Rollenkarte.',
        en: 'The wolf seer wakes up and points at a player. Show her that player’s role card.',
      },
    },
  },
  {
    id: 'whiteWerewolf',
    team: 'solo',
    icon: 'whiteWolf',
    color: '#d8d2c4',
    wakesWithWolves: true,
    name: { de: 'Weißer Werwolf', en: 'White Werewolf' },
    desc: {
      de: 'Jagt mit den Werwölfen, spielt aber für sich. Jede zweite Nacht darf er zusätzlich einen Werwolf töten. Er gewinnt nur, wenn er als Letzter übrig bleibt.',
      en: 'Hunts with the werewolves but plays for himself. Every second night he may additionally kill a werewolf. He only wins if he is the last one standing.',
    },
    night: {
      order: 50,
      when: 'everyOther',
      text: {
        de: 'Der weiße Werwolf erwacht und darf einen anderen Werwolf töten, wenn er möchte.',
        en: 'The white werewolf wakes up and may kill another werewolf if he wishes.',
      },
    },
  },
  {
    id: 'piper',
    team: 'solo',
    icon: 'piper',
    color: '#2e6a8a',
    name: { de: 'Flötenspieler', en: 'Pied Piper' },
    desc: {
      de: 'Verzaubert jede Nacht zwei Spieler. Die Verzauberten erkennen einander. Sind alle anderen lebenden Spieler verzaubert, gewinnt der Flötenspieler allein.',
      en: 'Charms two players every night. The charmed recognise each other. When all other living players are charmed, the piper wins alone.',
    },
    night: {
      order: 80,
      when: 'every',
      text: {
        de: 'Der Flötenspieler erwacht und verzaubert zwei Spieler. Danach erwachen alle Verzauberten kurz und erkennen einander.',
        en: 'The pied piper wakes up and charms two players. Then all charmed players wake briefly and recognise each other.',
      },
    },
  },
  {
    id: 'angel',
    team: 'solo',
    icon: 'angel',
    color: '#8ab0c8',
    name: { de: 'Engel', en: 'Angel' },
    desc: {
      de: 'Gewinnt sofort allein, wenn er bei der ersten Abstimmung oder in der ersten Nacht stirbt. Überlebt er beides, wird er zu einem einfachen Dorfbewohner.',
      en: 'Wins alone immediately if they die in the first vote or on the first night. If they survive both, they become a simple villager.',
    },
  },
  {
    id: 'serialKiller',
    team: 'solo',
    icon: 'serialKiller',
    color: '#3a1a1a',
    name: { de: 'Serienmörder', en: 'Serial Killer' },
    desc: {
      de: 'Tötet jede Nacht einen Spieler und kann von den Werwölfen nicht getötet werden. Gewinnt, wenn er als Einziger übrig bleibt.',
      en: 'Kills one player every night and cannot be killed by the werewolves. Wins if they are the only one left.',
    },
    night: {
      order: 65,
      when: 'every',
      text: {
        de: 'Der Serienmörder erwacht und zeigt auf sein Opfer.',
        en: 'The serial killer wakes up and points at their victim.',
      },
    },
  },
  {
    id: 'arsonist',
    team: 'solo',
    icon: 'arsonist',
    color: '#b8461a',
    name: { de: 'Brandstifter', en: 'Arsonist' },
    desc: {
      de: 'Übergießt jede Nacht ein Haus mit Öl – oder zündet alle übergossenen Häuser gleichzeitig an. Gewinnt, wenn er als Letzter übrig bleibt.',
      en: 'Douses one house with oil every night – or ignites all doused houses at once. Wins if they are the last one standing.',
    },
    night: {
      order: 67,
      when: 'every',
      text: {
        de: 'Der Brandstifter erwacht und übergießt ein Haus mit Öl – oder zündet alle übergossenen Häuser an.',
        en: 'The arsonist wakes up and douses a house with oil – or ignites all doused houses.',
      },
    },
  },
  {
    id: 'tanner',
    team: 'solo',
    icon: 'tanner',
    color: '#7a5a3a',
    name: { de: 'Gerber', en: 'Tanner' },
    desc: {
      de: 'Hasst seinen Job und sein Leben. Er gewinnt allein, wenn das Dorf ihn bei einer Abstimmung hinrichtet.',
      en: 'Hates his job and his life. He wins alone if the village executes him in a vote.',
    },
  },
];

export const BUILTIN_MAP: Record<string, RoleDef> = Object.fromEntries(BUILTIN_ROLES.map((r) => [r.id, r]));

export const TEAM_ORDER: Team[] = ['village', 'wolves', 'ambiguous', 'solo'];
