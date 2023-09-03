---
title: Hello World
layout: "layouts/base.njk"
---

<div class="c-large">
<p>Hello</p>
<ul>
{% for study in caseStudies %}
{% include "components/caseStudy.njk" %}
{% endfor %}
</ul>
</div>
