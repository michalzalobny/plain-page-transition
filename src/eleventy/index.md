---
title: Hello World
layout: "layouts/base.njk"
---

<div class="c-large">
<div class="main-page__wrapper">
<ul>
{% for study in caseStudies %}
{% include "components/caseStudy.njk" %}
{% endfor %}
</ul>
</div>
</div>
