# Angela Sakis Website




---

## Direct Self-Hosting with Caddy Server

1. Purchase a Domain Name
Choose a registrar like Namecheap, GoDaddy, or Google Domains.
Search for your desired domain (e.g., yourdomain.com), purchase it, and note it down.
2. Set Up DNS Records
Log in to your registrar’s control panel.
Navigate to the DNS management section.
Add an A record:
Host: @ (root domain) or a subdomain (e.g., www)
Value: Your server’s public IP address
Save the changes. Propagation may take a few hours.
3. Configure Caddy Server
Install Caddy on your server (see Caddy Installation Guide).
Create a Caddyfile in your server’s root directory (e.g., /etc/caddy/Caddyfile):
yourdomain.com {
    root * /var/www/html
    file_server
}
Replace yourdomain.com with your domain and adjust the root path to your website files.
Run caddy run or set it up as a service.
Using Cloudflare Proxies for Security
1. Set Up Cloudflare
Sign up at Cloudflare.
Add your domain and follow the setup wizard.
Update your registrar’s nameservers to Cloudflare’s provided nameservers (e.g., ns1.cloudflare.com, ns2.cloudflare.com).
Wait for DNS propagation (up to 48 hours, typically faster).
2. Configure DNS Records in Cloudflare
In the Cloudflare dashboard, go to DNS.
Add an A record:
Name: @ or subdomain (e.g., www)
IPv4 Address: Your server’s IP
Proxy Status: Enabled (orange cloud icon)
Save the record.
3. Update Caddy for Cloudflare Proxies
Modify your Caddyfile to trust Cloudflare’s proxies for HTTPS:
{
    trusted_proxies 173.245.48.0/20 103.21.244.0/22 103.22.200.0/22 103.31.4.0/22 141.101.64.0/18 108.162.192.0/18 190.93.240.0/20 188.114.96.0/20 197.234.240.0/22 198.41.128.0/17 162.158.0.0/15 104.16.0.0/12 172.64.0.0/13 131.0.72.0/22
}
yourdomain.com {
    root * /var/www/html
    file_server
}
Restart Caddy with caddy reload.
4. Enable Security Features
In Cloudflare’s SSL/TLS section, set encryption to Full or Full (strict).
Configure Firewall rules to block malicious traffic (see Cloudflare Docs).
Enable DDoS protection and other security options as needed.
5. Test Your Setup
Visit yourdomain.com in a browser.
Verify HTTPS is active and content loads correctly.
Additional Resources
Caddy Documentation
Cloudflare Documentation
This setup provides a secure, self-hosted website with Caddy and Cloudflare’s protection. Replace placeholders (e.g., yourdomain.com, /var/www/html) with your specific details.