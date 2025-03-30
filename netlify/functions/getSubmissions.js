exports.handler = async () => {
  const res = await fetch(`https://api.netlify.com/api/v1/sites/${process.env.SITE_ID}/submissions`, {
    headers: { Authorization: `Bearer ${process.env.NETLIFY_TOKEN}` }
  });
  return { statusCode: 200, body: JSON.stringify(await res.json()) };
};
