def __check_word_similarity(word_a, word_b):
    word_a = word_a.lower()
    word_b = word_b.lower()

    counter = 0
    for word in word_a:
        if word in word_b:
            counter += 1

    num_chars_a = len(word_a)

    similariy_count = counter / num_chars_a

    return similariy_count * 100

def __check_similarity(word_a, sentance):
    word_a = word_a.lower()
    sentance = sentance.lower()

    sentance_words = sentance.split(' ')

    similarity_scores = []

    for word in sentance_words:
        similarity_score = __check_word_similarity(word_a, word)

        similarity_scores.append(similarity_score)
        
        
    return similarity_scores


if __name__ == '__main__':
    sentance = 'wheat flour'
    word = 'weat'

    print(__check_similarity(word, sentance))
