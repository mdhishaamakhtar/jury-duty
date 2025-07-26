export function load({ url }) {
	return {
		hostname: url.hostname,
		protocol: url.protocol
	};
}
