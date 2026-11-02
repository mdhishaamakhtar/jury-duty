// Everything specific to one deployment lives here.
export const jury = {
	headline: 'Every post gets a fair hearing.',
	lead: 'Read one post at a time and decide it against the written guidelines. Every rater judges independently, like a juror.',
	footerNote: 'Confidential · Internal Use Only',
	guidelines: {
		summary:
			'Decide whether the user posting this post/comment confessed about relapsing into smoking',
		trueMeans: 'TRUE means a Relapse',
		falseMeans: 'FALSE means not a Relapse',
		intro:
			'You are a relapse detector. Decide whether the user posting this post/comment confessed about relapsing into smoking that is smoked again after quitting.',
		trueRules: [
			'only cases where the user confessed explicitly about themselves',
			'A relapse is ONLY when they EXPLICITLY MENTION that they smoked again AFTER quitting',
			'Ensure the user doesn’t talk about the relapse LONG into the past like “10 years ago” type but only in the recent past like “last wednesday” or “last week” or ambiguous time that seem like the recent past like “recently” or “a while back” as long its in the recent past.'
		],
		falseRules: [
			'Avoid ambiguous posts where an explicit relapse by themselves is not mentioned',
			'User mentioning craving does not mean they relapsed into smoking',
			'User mentioning someone else relapsing does not mean they relapsed themselves',
			'User mentioning desire to smoke in future does not mean a relapse',
			'User talking about past experience or habit is not a relapse'
		]
	},
	// Made-up posts for the landing page and the public demo. Never put real data here.
	samples: [
		"Three months without a cigarette, then my sister's wedding happened. I said yes before I even thought about it and smoked most of a pack that weekend. Day two again.",
		"Day 212 and the cravings still show up out of nowhere. Walked past the old smoking spot at work and my hands moved to my pocket. Didn't have one.",
		"My brother started again after six years clean and I can't stop thinking about it. Any advice for talking to him without making it worse?",
		'Slipped up again last night. One smoke. Back to day zero.',
		'Quit in 2014 and I still think about how much I loved that first one in the morning.\n\nNot tempted any more, just nostalgic.',
		'Thanks for writing this, I needed to read it today. I walked around the block every time the cravings came, and I told my partner so there was someone to be honest with.\n\nAnyway, for what it’s worth, I bought a pack on Friday after nearly a year clean and smoked four before I binned it. So I’m starting again right alongside you.'
	]
};
