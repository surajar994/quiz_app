fetch('questions.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('question-list');
    data.forEach((q, index) => {
      const div = document.createElement('div');
      div.classList.add('question-item');

      const question = document.createElement('p');
      question.className = 'question-text';
      question.textContent = `${q.id}. ${q.question}`;
      div.appendChild(question);

      const ul = document.createElement('ul');
      ul.className = 'option-list';
      q.options.forEach(opt => {
        const li = document.createElement('li');
        li.textContent = opt;
        ul.appendChild(li);
      });
      div.appendChild(ul);

      const ans = document.createElement('p');
      ans.className = 'correct-answer';
      ans.textContent = `Answer: ${q.answer}`;
      div.appendChild(ans);

      container.appendChild(div);
    });
  })
  .catch(err => {
    console.error('Failed to load questions:', err);
  });
