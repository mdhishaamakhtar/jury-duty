<script lang="ts">
	interface Props {
		size?: number;
		class?: string;
	}

	let { size = 32, class: className = '' }: Props = $props();
</script>

<svg 
	xmlns="http://www.w3.org/2000/svg" 
	width={size} 
	height={size} 
	viewBox="0 0 32 32" 
	class="drop-shadow-sm {className}"
>
	<title>Jury Duty Logo</title>
	
	<!-- Ballot Box Base -->
	<rect x="4" y="12" width="24" height="16" rx="2" ry="2" fill="#fecaca" stroke="#fca5a5" stroke-width="1"/>
	
	<!-- Ballot Box Slot -->
	<rect x="7" y="9" width="18" height="4" rx="2" ry="2" fill="#fca5a5"/>
	<rect x="8" y="10" width="16" height="2" fill="#f87171"/>
	
	<!-- Ballot Paper -->
	<rect x="11" y="4" width="10" height="12" rx="1" ry="1" fill="#fef7f7" stroke="#fed7d7" stroke-width="1"/>
	
	<!-- Ballot Options -->
	<circle cx="13.5" cy="7" r="1" fill="none" stroke="#d946ef" stroke-width="0.8"/>
	<circle cx="13.5" cy="10" r="1" fill="none" stroke="#d946ef" stroke-width="0.8"/>
	
	<!-- Selected Option -->
	<circle cx="13.5" cy="7" r="0.5" fill="#10b981"/>
	
	<!-- Option Labels -->
	<rect x="16" y="6.5" width="3" height="1" fill="#fbcfe8"/>
	<rect x="16" y="9.5" width="2.5" height="1" fill="#fbcfe8"/>
	
	<!-- Motion Lines -->
	<path d="M 14 14 L 16 16" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
	<path d="M 16 14 L 18 16" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
</svg>