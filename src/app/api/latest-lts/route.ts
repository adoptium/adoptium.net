export const dynamic = 'force-static';

export async function GET() {
  try {
    // Currently, we're hardcoding to return Java 21 as the latest LTS
    // In a production environment, this would ideally be fetched from an API
    // or a database that's regularly updated
    const data = {
      version: 21
    };
    
    return Response.json({ mostRecentLts: data });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch latest LTS version' + error }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
