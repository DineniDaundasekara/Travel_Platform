const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Listing = require('./models/Listing');

const SAMPLE_LISTINGS = [
  {
    title: "Sunset Boat Tour",
    location: "Bali, Indonesia",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    description: "Enjoy a beautiful sunset while sailing along the Bali coastline. Watch the sky transform into vivid oranges and pinks as the sun dips below the horizon. Includes welcome drinks and snorkeling equipment.",
    price: 45,
    currency: "USD",
    category: "Water Sports"
  },
  {
    title: "Ancient Temple Walking Tour",
    location: "Kyoto, Japan",
    imageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800",
    description: "Explore the ancient temples and shrines of Kyoto with a knowledgeable local guide. Visit Fushimi Inari, Kinkakuji, and hidden gems off the tourist trail. Morning tour to avoid crowds.",
    price: 35,
    currency: "USD",
    category: "Culture"
  },
  {
    title: "Street Food Night Market Tour",
    location: "Bangkok, Thailand",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    description: "Discover Bangkok's vibrant street food scene with a passionate local foodie. Taste 10+ dishes at famous night markets, learn about Thai ingredients, and find hidden local favorites tourists never find.",
    price: 28,
    currency: "USD",
    category: "Food & Drink"
  },
  {
    title: "Amazon Rainforest Expedition",
    location: "Manaus, Brazil",
    imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800",
    description: "3-day guided expedition into the Amazon rainforest. Spot wildlife including pink dolphins, macaws, and sloths. Sleep in eco-lodges, learn from indigenous guides, and paddle through flooded forest.",
    price: 220,
    currency: "USD",
    category: "Adventure"
  },
  {
    title: "Yoga & Meditation Retreat",
    location: "Rishikesh, India",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
    description: "A full day of yoga, meditation, and spiritual exploration by the Ganges River. Morning yoga at sunrise, guided meditation, Ayurvedic lunch, and evening Ganga aarti fire ceremony.",
    price: 55,
    currency: "USD",
    category: "Wellness"
  },
  {
    title: "Northern Lights Photography Tour",
    location: "Tromsø, Norway",
    imageUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800",
    description: "Chase the Northern Lights with a professional photographer as your guide. Drive to the best viewing spots away from city lights, learn night photography techniques, and capture stunning aurora photos.",
    price: 120,
    currency: "USD",
    category: "Adventure"
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Create demo user
  const hashedPw = await bcrypt.hash('password123', 12);
  let demoUser = await User.findOne({ email: 'demo@wanderlust.com' });
  if (!demoUser) {
    demoUser = await User.create({
      name: 'Alex Explorer',
      email: 'demo@wanderlust.com',
      password: hashedPw,
      bio: 'Travel enthusiast and experience creator',
    });
  }

  // Create listings
  for (const data of SAMPLE_LISTINGS) {
    const exists = await Listing.findOne({ title: data.title });
    if (!exists) {
      await Listing.create({ ...data, creator: demoUser._id });
      console.log(`✅ Created: ${data.title}`);
    }
  }

  console.log('\n🌍 Seed complete!');
  console.log('Demo login: demo@wanderlust.com / password123');
  mongoose.disconnect();
}

seed().catch(console.error);
