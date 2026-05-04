// ============================================================
// MOCK DATA: PLAYER STATS & MATCHES
// ============================================================
// You can delete this file when you're done testing your UI.
// To stop using it, just set `USE_MOCK_DATA = false` in your components.

export const MOCK_USER_ID = "mock-user-123";

const baseMatches = [
  // 1. Padel Victory: Against Slim & Amine, 6-4, 7-5, Yesterday
  {
    id: "match-1",
    winner_id: MOCK_USER_ID, // You won
    score: "6-4, 7-5",
    player1_id: MOCK_USER_ID,
    player2_id: "opponent-1",
    player1: { full_name: "You" },
    player2: { full_name: "Slim & Amine" },
    booking: {
      booking_date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      time_slot: "18:00",
      courts: { name: "Padel Arena - Court 1", surface: "Artificial Grass" }
    }
  },
  // Training Session: With Coach Ahmed, 1.5 hours, 2 days ago
  {
    id: "match-training",
    winner_id: null,
    score: "1.5 hours",
    player1_id: MOCK_USER_ID,
    player2_id: "coach-ahmed",
    player1: { full_name: "You" },
    player2: { full_name: "Coach Ahmed" },
    match_type: "training",
    booking: {
      booking_date: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
      time_slot: "16:00",
      courts: { name: "Training Court", surface: "Artificial Grass" }
    }
  },
  // 2. Padel Match: Against Mourad & Zied, 3-6, 4-6, 4 days ago
  {
    id: "match-2",
    winner_id: "opponent-2", // You lost
    score: "3-6, 4-6",
    player1_id: MOCK_USER_ID,
    player2_id: "opponent-2",
    player1: { full_name: "You" },
    player2: { full_name: "Mourad & Zied" },
    booking: {
      booking_date: new Date(Date.now() - 4 * 86400000).toISOString(), // 4 days ago
      time_slot: "20:00",
      courts: { name: "Padel Pro Tunisia", surface: "Indoor" }
    }
  },
  // 3. Ongoing Match: LIVE, 6-4, 3-2, Set 2
  {
    id: "match-3",
    winner_id: null, // Ongoing
    score: "6-4, 3-2",
    player1_id: MOCK_USER_ID,
    player2_id: "opponent-3",
    player1: { full_name: "Ahmed & Slim" },
    player2: { full_name: "Mourad & Zied" },
    booking: {
      booking_date: new Date().toISOString(), // Today
      time_slot: "19:00",
      courts: { name: "Padel Arena - Court 1", surface: "Artificial Grass" }
    }
  },
  // 4. Upcoming Match: Friday, May 5, 19:00
  {
    id: "match-4",
    winner_id: null, // Upcoming
    score: null,
    player1_id: MOCK_USER_ID,
    player2_id: "partner-1",
    player1: { full_name: "You" },
    player2: { full_name: "Yassine" },
    booking: {
      booking_date: new Date(Date.now() + 3 * 86400000).toISOString(), // 3 days from now
      time_slot: "19:00",
      courts: { name: "Padel Pro Tunisia - Court 3", surface: "Indoor" }
    }
  },
  // Match History - Win
  {
    id: "match-5",
    winner_id: MOCK_USER_ID,
    score: "6-2, 6-3",
    player1_id: MOCK_USER_ID,
    player2_id: "opponent-4",
    player1: { full_name: "You" },
    player2: { full_name: "Marsa Padel" },
    booking: {
      booking_date: new Date(Date.now() - 6 * 86400000).toISOString(),
      time_slot: "14:00",
      courts: { name: "Marsa Padel", surface: "Outdoor" }
    }
  },
  // Match History - Loss
  {
    id: "match-6",
    winner_id: "opponent-5",
    score: "4-6, 5-7",
    player1_id: MOCK_USER_ID,
    player2_id: "opponent-5",
    player1: { full_name: "You" },
    player2: { full_name: "Lake Club" },
    booking: {
      booking_date: new Date(Date.now() - 10 * 86400000).toISOString(),
      time_slot: "16:00",
      courts: { name: "Lake Club", surface: "Artificial Grass" }
    }
  },
  // Match History - Win
  {
    id: "match-7",
    winner_id: MOCK_USER_ID,
    score: "7-5, 6-4",
    player1_id: MOCK_USER_ID,
    player2_id: "opponent-6",
    player1: { full_name: "You" },
    player2: { full_name: "Padel Pro Tunisia" },
    booking: {
      booking_date: new Date(Date.now() - 14 * 86400000).toISOString(),
      time_slot: "10:00",
      courts: { name: "Padel Pro Tunisia", surface: "Indoor" }
    }
  }
];

// We need 24 total sessions. Currently we have 3 wins and 2 losses in history (5 finished matches).
// To reach a 68% win rate over 24 sessions, we need about 16 wins total (16/24 = 66.6%, close enough, we'll do 16 wins and 8 losses).
// So let's pad the remaining matches (13 more wins, 6 more losses).
const paddingMatches = [];
for (let i = 0; i < 13; i++) {
  paddingMatches.push({
    id: `match-win-pad-${i}`,
    winner_id: MOCK_USER_ID,
    score: "6-2, 6-2",
    player1_id: MOCK_USER_ID,
    player2_id: "random",
    player1: { full_name: "You" },
    player2: { full_name: "Random Opponent" },
    booking: {
      booking_date: new Date(Date.now() - (20 + i) * 86400000).toISOString(),
      time_slot: "10:00",
      courts: { name: "Training Court", surface: "Indoor" }
    }
  });
}
for (let i = 0; i < 6; i++) {
  paddingMatches.push({
    id: `match-loss-pad-${i}`,
    winner_id: "random",
    score: "4-6, 4-6",
    player1_id: MOCK_USER_ID,
    player2_id: "random",
    player1: { full_name: "You" },
    player2: { full_name: "Random Opponent" },
    booking: {
      booking_date: new Date(Date.now() - (35 + i) * 86400000).toISOString(),
      time_slot: "10:00",
      courts: { name: "Training Court", surface: "Indoor" }
    }
  });
}

export const MOCK_MATCHES = [...baseMatches, ...paddingMatches];

export const MOCK_BOOKINGS = [
  {
    id: "booking-1",
    booking_date: new Date(Date.now() + 24 * 3600000).toISOString(), // Tomorrow
    time_slot: "10:00 - 11:30",
    status: "confirmed",
    courts: { name: "Padel Arena - Court 2" }
  },
  {
    id: "booking-2",
    booking_date: new Date(Date.now() + 48 * 3600000).toISOString(), // Day after tomorrow
    time_slot: "18:00 - 19:30",
    status: "pending",
    courts: { name: "Padel Club" }
  }
];

export const MOCK_FEEDBACKS = [
  {
    content: "Training Session: 1.5 hours. Excellent footwork today. Keep pushing!",
    speed: 85,
    power: 78,
    technique: 88,
    stamina: 80,
    mental: 92
  },
  {
    content: "Good effort against Mourad & Zied. Don't let the score get to you. Keep practicing those lobs.",
    speed: 80,
    power: 75,
    technique: 85,
    stamina: 75,
    mental: 85
  }
];

export const MOCK_TOURNAMENTS = [
  {
    id: "mock-tournament-1",
    title: "Final: Tunisian Cup",
    description: "The most prestigious padel tournament in Tunisia. Watch the best players compete for the cup.",
    start_date: new Date(Date.now() + 15 * 60000).toISOString(), // Starts in 15 min
    end_date: new Date(Date.now() + 2 * 3600000).toISOString(),
    max_players: 32,
    current_players: 28,
    prize_pool: "5000 DT",
    competition_type: "Professional",
    registration_deadline: new Date(Date.now() - 24 * 3600000).toISOString(),
    entry_fee: 50,
    clubs: { name: "Marsa Padel Club", location: "Marsa, Tunis" },
    userRegistration: null,
    isMock: true
  },
  {
    id: "mock-tournament-2",
    title: "Friendly: Pro Group",
    description: "Join our weekend friendly pro group sessions. Great for networking and improving your game.",
    start_date: new Date(new Date().setHours(21, 0, 0, 0)).toISOString(), // Starts at 21:00
    end_date: new Date(new Date().setHours(23, 0, 0, 0)).toISOString(),
    max_players: 16,
    current_players: 12,
    prize_pool: "Trophy Only",
    competition_type: "Friendly",
    registration_deadline: new Date(Date.now() + 3600000).toISOString(),
    entry_fee: 20,
    clubs: { name: "Padel Club", location: "Berges du Lac" },
    userRegistration: null,
    isMock: true
  },
  {
    id: "mock-tournament-3",
    title: "Summer Padel Open",
    description: "Our annual summer open is here! Open to all skill levels. Categories: Men, Women, and Mixed.",
    start_date: new Date(Date.now() + 7 * 24 * 3600000).toISOString(), // 7 days away
    max_players: 64,
    current_players: 45,
    prize_pool: "2000 DT",
    competition_type: "Open",
    registration_deadline: new Date(Date.now() + 5 * 24 * 3600000).toISOString(),
    entry_fee: 35,
    clubs: { name: "Padel Pro Tunisia", location: "Tunis" },
    userRegistration: { id: "reg-1", status: "accepté" },
    isMock: true
  }
];

export const MOCK_STATS = {
  performanceScore: 84,
  winRate: 68,
  sessions: 24,
  rank: "Top 12% in Tunisia",
  wins: 16,
  losses: 8,
  upcoming: 1
};export const MOCK_ADMIN_MATCHES = [
  // Live match — 2nd set in progress
  {
    id: "admin-match-1",
    status: "live",
    score: "6-4, 3-2",
    points: "30-15",
    match_type: "doubles",
    winner_team: null,
    player1_id: "user-1",
    player2_id: "user-2",
    player3_id: "user-3",
    player4_id: "user-4",
    player1: { full_name: "Ahmed Laouini" },
    player2: { full_name: "Yassine Ben Ali" },
    player3: { full_name: "Yossr Ellefi" },
    player4: { full_name: "Senda zaghdoudi" },
    booking: {
      booking_date: new Date().toISOString().split('T')[0],
      time_slot: "10:00 - 11:30",
      courts: { name: "Court A" }
    }
  },
  // Paused match — 3rd set just started
  {
    id: "admin-match-2",
    status: "paused",
    score: "7-5, 2-6, 1-1",
    points: "15-15",
    match_type: "doubles",
    winner_team: null,
    player1_id: "user-5",
    player2_id: "user-6",
    player3_id: "user-7",
    player4_id: "user-8",
    player1: { full_name: "Karim Mansouri" },
    player2: { full_name: "Bilel Gharbi" },
    player3: { full_name: "Nabil Ferjani" },
    player4: { full_name: "Sami Trabelsi" },
    booking: {
      booking_date: new Date().toISOString().split('T')[0],
      time_slot: "11:00 - 12:30",
      courts: { name: "Court B" }
    }
  },
  // Scheduled match — hasn't started yet
  {
    id: "admin-match-3",
    status: "scheduled",
    score: "0-0",
    match_type: "doubles",
    winner_team: null,
    player1_id: "user-9",
    player2_id: "user-10",
    player3_id: "user-11",
    player4_id: "user-12",
    player1: { full_name: "Rami Bouaziz" },
    player2: { full_name: "Amine Jlassi" },
    player3: { full_name: "Hatem Dridi" },
    player4: { full_name: "Wael Cherni" },
    booking: {
      booking_date: new Date().toISOString().split('T')[0],
      time_slot: "13:00 - 14:30",
      courts: { name: "Court C" }
    }
  },
  // Completed match — Team 1 won 6-2, 6-3
  {
    id: "admin-match-4",
    status: "completed",
    score: "6-2, 6-3",
    match_type: "doubles",
    winner_team: 1, // Team 1 (player1 + player2) won
    player1_id: "user-13",
    player2_id: "user-14",
    player3_id: "user-15",
    player4_id: "user-16",
    player1: { full_name: "Sofiane Belkaid" },
    player2: { full_name: "Tarek Ouali" },
    player3: { full_name: "Lotfi Aissa" },
    player4: { full_name: "Mehdi Chaker" },
    booking: {
      booking_date: new Date().toISOString().split('T')[0],
      time_slot: "09:00 - 10:30",
      courts: { name: "Court A" }
    }
  }
];
