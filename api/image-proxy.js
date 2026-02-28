// Image Proxy untuk bypass CORS
// Deploy ke Vercel sebagai API route

export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter required' });
    }

    try {
        const imageUrl = decodeURIComponent(url);

        // Validate URL (only allow dramabox domains)
        const allowedDomains = [
            'drmbox.xyz',
            'dramabox',
            'sansekai.my.id',
            'cloudfront.net'
        ];

        const isAllowed = allowedDomains.some(domain => imageUrl.includes(domain));
        if (!isAllowed) {
            return res.status(403).json({ error: 'Domain not allowed' });
        }

        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://www.dramabox.com/',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch image' });
        }

        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const buffer = await response.arrayBuffer();

        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
        res.setHeader('Access-Control-Allow-Origin', '*');

        return res.send(Buffer.from(buffer));

    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({ error: 'Proxy failed' });
    }
}
