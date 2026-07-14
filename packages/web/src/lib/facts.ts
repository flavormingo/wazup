const FACTS = `Hemp is an alternative to plastic.
Honey never spoils.
The Moon has moonquakes.
Bananas are berries.
Crows remember people.
You are one of a kind.
Sea otters hold hands.
Octopuses have three hearts.
Flamingos aren't born pink.
The Sun is a star.
Koalas have fingerprints.
Pineapples take years to grow.
Your effort matters.
Sharks are older than trees.
You can trust yourself.
The ocean has hidden mountains.
Bees recognize faces.
Butterflies taste with their feet.
Some trees live thousands of years.
Penguins give pebble gifts.
Fresh air helps.
Sloths can swim.
The Earth is not a perfect sphere.
Good things take time.
Clouds can weigh tons.
You can always begin again.
Some flowers bloom at night.
Whales sing to communicate.
Snowflakes have unique patterns.
Coconuts can travel by sea.
The first bicycle had no pedals.
A group of flamingos is a flamboyance.
Rest is productive too.
Cats can make over 100 sounds.
Turtles can breathe through their butts.
Rain has a smell called petrichor.
You deserve kindness.
Starfish have no brains.
A day on Venus is longer than its year.
Otters have a favorite rock.
Slow progress is still progress.
Jellyfish are older than dinosaurs.
Cows have best friends.
Lightning is hotter than the Sun.
Take the break you need.
Elephants can't jump.
Seahorses mate for life.
A shrimp's heart is in its head.
Your feelings are valid.
Ducks can sleep with one eye open.
Frogs can freeze and thaw alive.
Mushrooms are closer to animals.
You are enough as you are.
Owls can turn their heads far around.
Some cats are allergic to humans.
Sea stars can regrow arms.
Be gentle with yourself.
Hummingbirds can fly backward.
A snail can sleep for years.
Goats have rectangular pupils.
It's okay to ask for help.
Narwhals have a giant tooth.
Ants never sleep the way we do.
You matter more than you know.
Water can boil and freeze at once.
The heart of a blue whale is huge.
Spiders can fly on the wind.
Small steps still count.
Camels have three eyelids.
A cloud can float for days.
Foxes use magnetic fields to hunt.
Kindness always comes back.
Dolphins have names for each other.
Trees can talk through their roots.
A jiffy is a real unit of time.
Puffins can flap 400 times a minute.
Some frogs glow in the dark.
Wombats have backward pouches.
Breathe. You've got this.
Octopuses can taste with their arms.
Mantis shrimp punch super fast.
A rainbow is actually a full circle.
Progress over perfection.
Chinchillas take dust baths.
Axolotls can regrow body parts.
Bees dance to share directions.
You're doing better than you think.
A group of owls is a parliament.
Tardigrades can survive in space.
Snow is not actually white.
Let yourself rest today.
Sharks existed before Saturn's rings.
Pigeons can recognize themselves.
A day was once only 22 hours.
You are worthy of good things.
Beavers build dams you can see from space.
Some jellyfish never really die.
Reindeer eyes turn blue in winter.
Take it one moment at a time.
Sea otters have pockets for tools.
A flea can jump 100 times its height.
Whales have belly buttons.
You bring something no one else does.
Crabs can walk in every direction.
Kangaroos can't walk backward.
A snail has thousands of tiny teeth.
It's okay to slow down.
Bats always turn left in caves.
Squirrels plant thousands of trees.
The Moon drifts away each year.
You are growing every day.
Cats walk like camels and giraffes.
Butterflies can see more colors.
Trust the timing of your life.
Elephants comfort each other.
Some spiders decorate their webs.
Sea turtles cry to shed salt.
A group of crows is a murder.
Give yourself grace.
Sloths only poop once a week.
Honeybees have five eyes.
Volcanoes can create new islands.
You've come so far already.
Giraffes hum to each other at night.
A snowflake starts around dust.
Cats can't taste sweetness.
Your pace is the right pace.
Dogs dream like people do.
Lobsters taste with their legs.
Some fish can climb waterfalls.
Ravens can mimic human speech.
The Sahara was once green.
A hippo's sweat is pink.
Be proud of small wins.
Embrace change.
Octopuses have blue blood.
A group of jellyfish is a smack.
Wolves howl to find each other.
Starfish can eat inside out.
A shrimp can only swim backward well.
Fireflies flash to say hello.
Give yourself permission to rest.
Platypuses glow under UV light.
Snakes smell with their tongues.
The deepest sea is mostly unmapped.
Owls can't move their eyes.
Let go of what you can't control.
A group of pandas is an embarrassment.
Your kindness ripples outward.
Moths drink the tears of some animals.
Squids can be bigger than a bus.
Elephants recognize themselves too.
The Milky Way smells like rum.
Frogs drink water through their skin.
Take a deep breath.
Bats are the only flying mammals.
You are loved more than you know.
Toucans use their beaks to cool off.
Kangaroos use their tails as a leg.
Coral is a living animal.
The Moon has no wind or weather.
Be here for this moment.
Whale songs travel for miles.
You are becoming who you're meant to be.
Pandas do somersaults for fun.
Hedgehogs were once called urchins.
Crabs communicate by drumming.
You are not behind in life.
Otters wrap up in kelp to sleep.
Ladybugs can play dead.
Manatees are related to elephants.
Chickens can dream in color.
The sky is blue from scattered light.
Turtles existed before dinosaurs.
Cats knead when they feel safe.
The ocean makes most of our oxygen.
Beetles are the most common animal.
Let peace find you today.
Parrots can name their chicks.
You've survived every hard day so far.
Elephants are afraid of bees.
The Northern Lights make sound.
Sea otters have thick warm fur.
Be kind to who you were.
Crickets chirp faster when it's warm.
Goats were one of the first pets.
Pufferfish make sand art.
It's okay to change your mind.
Cows produce more milk with music.
Moths can smell from miles away.
Koalas sleep most of the day.
Sloths grow algae in their fur.
The Moon is slowly rusting.
The first hard drive weighed a ton.
The first skateboards had clay wheels.
The first computer bug was real moths.
Humans eat billions of pizzas every year.`
  .split('\n')
  .filter(Boolean);

export function randomFact(): string {
  return FACTS[Math.floor(Math.random() * FACTS.length)];
}
