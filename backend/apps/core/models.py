from django.db import models


class TimeStampedModel(models.Model):
    """
    An abstract base class model that provides self-updating
    ``created_at`` and ``updated_at`` fields.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


DEFAULT_SHORT_INTRO = (
    "JP Engineering & Construction Pvt. Ltd. is a leading manufacturer and supplier of "
    "machinery for various industrial sectors since 10 years. Our product range includes "
    "machinery for community-based water treatment systems, industrial water plants, "
    "dairy plants, industrial refrigeration, solar energy and irrigation, solar energy and "
    "heat pump system and meat mincing and packaging. The company provides water treatment "
    "systems for schools, colleges, hospitals, public institutions, and corporate houses."
)

DEFAULT_FULL_INTRO = """JP Engineering & Construction Pvt. Ltd. is a leading manufacturer and supplier of machinery for various industrial sectors since 10 years. Our product range includes machinery for community-based water treatment systems, industrial water plants, dairy plants, industrial refrigeration, solar energy and irrigation, solar energy and heat pump system and meat mincing and packaging.

The company provides water treatment systems for schools, colleges, hospitals, public institutions, and corporate houses. These systems are designed to effectively treat water and make it safe for human consumption. The industrial water plants offered by the company include equipment for the bottle and jar sections, ensuring efficient water processing for industrial use.

In the dairy industry, JP Engineering & Construction Pvt. Ltd. provides machinery for the production of various dairy products such as pouch milk, curd, ghee, ice cream, cheese, panir, khuwa, and bottled dairy products. Their dairy industrial plant machinery is designed to meet the highest standards of quality and efficiency.

The company also specializes in industrial refrigeration systems, providing equipment for the storage of vaccines, vegetables, fruits, dairy products, medicines, and similar products. We offer complete solutions, including refrigeration units and their necessary spare parts and equipment.

JP Engineering & Construction Pvt. Ltd. is also a leader in the development of solar energy and irrigation systems. Their solar irrigation systems use solar power to provide water for irrigation, making them environmentally friendly and cost-effective. Additionally, the company provides solar energy and heat pump systems for hotels, hostels, hospitals, and corporate houses, ensuring energy efficiency and cost savings.

In addition to the above, the company is also involved in steel fabrication work, which includes tanker fabrication, SS tank fabrication, vessel fabrication, basin fabrication, kitchen shelf fabrication, and other equipment fabrication. The company is looking to expand its scope of operations into the construction industry, and has already begun offering construction services to its clients.

Finally, the company offers meat mincing and packaging machinery, including meat grinders, vacuum packaging machines, plastic sealer machines, sausage stuffers, and similar equipment. These machines are designed to meet the needs of the meat processing industry and are built to the highest standards of quality and performance.

In conclusion, JP Engineering & Construction Pvt. Ltd. is a one-stop solution for all machinery needs in various industrial sectors including some construction work (the scope of construction is limited at the moment at JP Engineering but we are looking forward to increasing our working area in the field of construction as well). We provide high-quality and efficient machinery, designed to meet the specific needs of our clients along with technical support, with a focus on customer satisfaction and a commitment to excellence. JP Engineering & Construction Pvt. Ltd. is a reliable and trustworthy partner for all machinery needs."""


class SiteContent(TimeStampedModel):
    """
    Singleton CMS model for managing site-wide corporate introduction copy.
    """
    title = models.CharField(
        max_length=255,
        default="JP Engineering & Construction Pvt. Ltd.",
        help_text="Company or site title."
    )
    short_intro = models.TextField(
        default=DEFAULT_SHORT_INTRO,
        help_text="Short introduction displayed on the home page."
    )
    full_intro = models.TextField(
        default=DEFAULT_FULL_INTRO,
        help_text="Full introduction displayed on the /about/introduction page."
    )

    class Meta:
        verbose_name = "Site Content"
        verbose_name_plural = "Site Content"

    def __str__(self):
        return self.title

    @classmethod
    def get_solo(cls):
        obj = cls.objects.first()
        if not obj:
            obj = cls.objects.create(
                title="JP Engineering & Construction Pvt. Ltd.",
                short_intro=DEFAULT_SHORT_INTRO,
                full_intro=DEFAULT_FULL_INTRO,
            )
        return obj


FAQ_PAGE_CHOICES = [
    ('all', 'All Pages / Global'),
    ('products', 'Products Page & Catalog'),
    ('industries', 'Industries We Serve'),
    ('contact', 'Contact Us'),
    ('introduction', 'About Us - Introduction'),
    ('company-profile', 'About Us - Company Profile'),
    ('our-team', 'About Us - Our Team'),
    ('our-clients', 'About Us - Our Clients'),
    ('our-partners', 'About Us - Business Partners'),
]


class FAQ(TimeStampedModel):
    """
    Dynamic FAQ model managed through the CMS.
    Allows staff to create, edit, reorder, and publish FAQs for specific subpages or site-wide.
    """
    question = models.CharField(max_length=500, help_text="The question text.")
    answer = models.TextField(help_text="The detailed answer text.")
    page = models.CharField(
        max_length=50,
        choices=FAQ_PAGE_CHOICES,
        default='all',
        help_text="Target subpage where this FAQ is displayed."
    )
    category = models.CharField(
        max_length=100,
        blank=True,
        default='',
        help_text="Optional topic category (e.g. Fabrication, Warranty, Commissioning)."
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Display order (lower numbers appear first)."
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this FAQ is published and visible on the website."
    )

    class Meta:
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"
        ordering = ['order', 'id']

    def __str__(self):
        return f"[{self.page}] {self.question[:60]}"

