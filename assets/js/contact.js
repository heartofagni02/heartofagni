// Contact Page JavaScript - Form removed version

document.addEventListener('DOMContentLoaded', function () {
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function () {
            faqItems.forEach(other => {
                if (other !== item) other.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    // Smooth scroll from FAQ CTA to top
    const faqCtaLink = document.querySelector('.faq-cta a');
    if (faqCtaLink) {
        faqCtaLink.addEventListener('click', function (e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
});