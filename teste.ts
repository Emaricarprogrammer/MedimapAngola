import * as dns from 'dns';

function resolveDNS(domain: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        dns.resolve(domain, 'A', (err, addresses) => {
            if (err) {
                reject(err);
            } else {
                resolve(addresses);
            }
        });
    });
}
async function main() {
    const domain = 'www.google.com';

    try {
        const ipAddresses = await resolveDNS(domain);
        console.log(`Endereços IP paa ${domain}:`, ipAddresses);
    } catch (error) {
        console.error('Erro ao resolver o DNS:', error);
    }
}

main();